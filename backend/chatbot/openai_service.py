import logging
import os
import re
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()


class OpenAIService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY") 
        self.client = OpenAI(api_key=self.api_key)
        self.openai_available = True
    
    def create_prompt_with_medicines(self, user_question, context):
        return f"""Bạn là dược sĩ chuyên nghiệp. Khách hàng hỏi: "{user_question}"

                    Thuốc có sẵn trong nhà thuốc:
                    {context}

                    QUY TẮC QUAN TRỌNG:
                    - CHỈ tư vấn về những thuốc có trong danh sách trên
                    - KHÔNG đề cập thuốc nào khác ngoài danh sách
                    - PHÂN TÍCH câu hỏi để xác định khách hàng hỏi về phần nào cụ thể

                    HƯỚNG DẪN TRẢ LỜI THEO CÂU HỎI:

                    Nếu hỏi CHỈ VỀ CÔNG DỤNG (dùng để gì, điều trị gì, có tác dụng gì):
                    **Công dụng:**
                    [Chỉ viết về công dụng và chỉ định của thuốc]

                    Nếu hỏi CHỈ VỀ CÁCH DÙNG (uống như thế nào, liều dùng, cách sử dụng):
                    **Cách sử dụng:**
                    [Chỉ viết về cách dùng và liều lượng]

                    Nếu hỏi CHỈ VỀ GIÁ (bao nhiêu tiền, giá cả):
                    **Giá cả:**
                    [Chỉ viết về thông tin giá thuốc]

                    Nếu hỏi CHỈ VỀ LƯU Ý (có tác dụng phụ gì, chú ý gì, cảnh báo, mẫn cảm, dị ứng):
                    **Lưu ý quan trọng:**
                    [Chỉ viết về các lưu ý an toàn, cảnh báo, tác dụng phụ]

                    Nếu hỏi TỔNG QUÁT hoặc nhiều phần cùng lúc (ví dụ: "tôi đau bụng", "cho tôi biết về thuốc X"):
                    **Giới thiệu và công dụng:**
                    [Viết 2-3 câu giới thiệu thuốc và công dụng]

                    **Cách sử dụng:**
                    [Hướng dẫn cách sử dụng chi tiết]

                    **Giá cả:**
                    [Thông tin giá thuốc cụ thể]

                    **Lưu ý quan trọng:**
                    [Các lưu ý an toàn]

                    LƯU Ý VỀ FORMAT:
                    - BẮT BUỘC sử dụng đúng format header: **Tên Section:**
                    - Phải có 2 dấu sao ** ở đầu và cuối, và dấu hai chấm : ở cuối
                    - VÍ DỤ: **Công dụng:** KHÔNG PHẢI Công dụng: hay **Công dụng**
                    - Chỉ viết nội dung section được hỏi, KHÔNG viết thêm section khác
                    - LUÔN LUÔN sử dụng header ngay cả khi chỉ trả lời 1 section

                    KHÔNG được sử dụng emoji, không bullet points trong header."""
    
    def create_prompt_without_medicines(self, user_question):
        return f"""Bạn là dược sĩ chuyên nghiệp. Khách hàng hỏi: "{user_question}"

                    Hiện tại nhà thuốc không có thuốc cụ thể nào phù hợp với yêu cầu này.

                    Hãy trả lời:
                    - Nếu là lời chào: chào lại thân thiện
                    - Nếu hỏi thuốc không có: xin lỗi và khuyên tham khảo dược sĩ hoặc bác sĩ
                    - Nếu hỏi triệu chứng: tư vấn chung và khuyên đến cơ sở y tế

                    KHÔNG đề cập bất kỳ tên thuốc cụ thể nào. Trả lời ngắn gọn, không emoji."""
    
    def call_openai_api(self, prompt):
        response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",  # Đổi từ gpt-4-turbo về gpt-3.5-turbo để tiết kiệm chi phí
                messages=[
                    {
                        "role": "system", 
                        "content": "Bạn là dược sĩ chuyên nghiệp, tư vấn thuốc an toàn và có trách nhiệm. KHÔNG sử dụng emoji trong phản hồi."
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                max_tokens=300,  # Giảm từ 500 xuống 300 để tiết kiệm chi phí
                temperature=1.0  # Tăng từ 0.7 lên 1.0 để nhanh hơn
            )
        ai_response = response.choices[0].message.content.strip()     
        return ai_response
    
    def generate_response(self, user_question, medicine_context, medicines):
        if medicines:
                prompt = self.create_prompt_with_medicines(user_question, medicine_context)
                ai_response = self.call_openai_api(prompt)
                
                # Phân tích xem OpenAI trả lời section nào
                response_type = self.analyze_response_type(user_question, ai_response)
                
                return {
                    'response': ai_response,
                    'medicines': medicines,
                    'type': 'openai_response',
                    'medicines_count': len(medicines),
                    'response_type': response_type,  # general, specific_section, text_only
                    'sections_answered': self.detect_sections_in_response(ai_response)
                }
        else:
                prompt = self.create_prompt_without_medicines(user_question)
                return {
                    'response': self.call_openai_api(prompt),
                    'medicines': [],
                    'type': 'text_only',
                    'medicines_count': 0,
                    'response_type': 'text_only',
                    'sections_answered': []
                }
    
    def analyze_response_type(self, user_question, ai_response):
        """Phân tích xem câu hỏi và phản hồi thuộc loại nào"""
        question_lower = user_question.lower()
        
        # Kiểm tra xem có phải câu hỏi specific section không
        specific_keywords = {
            'price': ['giá', 'bao nhiêu tiền', 'giá cả', 'chi phí', 'tiền'],
            'usage': ['cách dùng', 'cách sử dụng', 'uống như thế nào', 'liều dùng', 'dùng ra sao'],
            'benefit': ['công dụng', 'dùng để gì', 'điều trị gì', 'có tác dụng gì', 'chữa bệnh gì'],
            'warning': ['lưu ý', 'tác dụng phụ', 'cảnh báo', 'chú ý gì', 'có hại không', 'an toàn không']
        }
        
        # Đếm số sections trong response
        section_count = len(self.detect_sections_in_response(ai_response))
        
        # Kiểm tra xem có hỏi specific section không
        for section_type, keywords in specific_keywords.items():
            if any(keyword in question_lower for keyword in keywords):
                if section_count <= 1:  # Chỉ có 1 section được trả lời
                    return 'specific_section'
        
        # Nếu có nhiều section hoặc hỏi tổng quát
        if section_count >= 3:
            return 'general'
        elif section_count >= 1:
            return 'specific_section'
        else:
            return 'text_only'
    
    def detect_sections_in_response(self, ai_response):
        """Phát hiện các section có trong response"""
        sections = []
        
        # Các pattern để detect sections
        section_patterns = [
            (r'\*\*Công dụng:\*\*|\*\*Giới thiệu.*?\*\*', 'benefit'),
            (r'\*\*Cách sử dụng:\*\*|\*\*Cách dùng.*?\*\*', 'usage'),  
            (r'\*\*Giá cả:\*\*|\*\*Giá.*?\*\*', 'price'),
            (r'\*\*Lưu ý.*?\*\*|\*\*Cảnh báo.*?\*\*', 'warning')
        ]
        
        for pattern, section_name in section_patterns:
            if re.search(pattern, ai_response, re.IGNORECASE):
                sections.append(section_name)
        
        return sections