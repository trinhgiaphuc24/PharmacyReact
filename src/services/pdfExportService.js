import jsPDF from 'jspdf';

class PDFExportService {
  constructor() {
    this.doc = null;
    this.pageWidth = 210; // A4 width in mm
    this.pageHeight = 297; // A4 height in mm
    this.margin = 20;
  }

  removeVietnameseAccents(text) {
    if (!text) return "";
    
    const vietnamese_chars = {
      'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a', 'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
      'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
      'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
      'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o', 'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
      'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u', 'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
      'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
      'đ': 'd',
      'À': 'A', 'Á': 'A', 'Ạ': 'A', 'Ả': 'A', 'Ã': 'A', 'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',
      'È': 'E', 'É': 'E', 'Ẹ': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E',
      'Ì': 'I', 'Í': 'I', 'Ị': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
      'Ò': 'O', 'Ó': 'O', 'Ọ': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O', 'Ỡ': 'O',
      'Ù': 'U', 'Ú': 'U', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ử': 'U', 'Ữ': 'U',
      'Ỳ': 'Y', 'Ý': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
      'Đ': 'D'
    };
    
    let result = "";
    for (const char of text) {
      result += vietnamese_chars[char] || char;
    }
    return result;
  }

  async exportOrderPDF(order) {
    try {
      // Only allow PDF export for delivered orders
      if (order.status !== 'delivered') {
        throw new Error('Chỉ có thể xuất hóa đơn cho đơn hàng đã giao');
      }

      this.doc = new jsPDF();
      const width = this.pageWidth;
      const height = this.pageHeight;
      
      // Use Times-Roman fonts for better Vietnamese support
      this.doc.setFont("times", "normal");
      this.doc.setFontSize(12);
      
      // Header
      this.doc.setFillColor(33, 140, 33); // Green color
      this.doc.rect(0, 0, width, 40, 'F');
      
      this.doc.setTextColor(255, 255, 255); // White text
      this.doc.setFont("times", "bold");
      this.doc.setFontSize(18);
      const title = this.removeVietnameseAccents("NHA THUOC GIA PHUC");
      const titleWidth = this.doc.getTextWidth(title);
      this.doc.text(title, (width - titleWidth) / 2, 18);
      
      this.doc.setFont("times", "normal");
      this.doc.setFontSize(11);
      const address = this.removeVietnameseAccents("313 Hai Ba Trung, Q. Le Chan, TP. Hai Phong");
      const addressWidth = this.doc.getTextWidth(address);
      this.doc.text(address, (width - addressWidth) / 2, 28);
      
      const contact = "Hotline: 1800 6821 | nhathuocgiaphuc.com";
      const contactWidth = this.doc.getTextWidth(contact);
      this.doc.text(contact, (width - contactWidth) / 2, 34);
      
      // Invoice title
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFont("times", "bold");
      this.doc.setFontSize(16);
      const invoiceTitle = this.removeVietnameseAccents("HOA DON BAN THUOC");
      const invoiceTitleWidth = this.doc.getTextWidth(invoiceTitle);
      this.doc.text(invoiceTitle, (width - invoiceTitleWidth) / 2, 50);
      
      // Order info
      let yPosition = 65;
      this.doc.setFont("times", "normal");
      this.doc.setFontSize(11);
      
      const orderDate = order.date ? 
        new Date(order.date).toLocaleDateString('vi-VN') : 
        (order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : 
         new Date().toLocaleDateString('vi-VN'));
      
      this.doc.text(`Ma hoa don: ${String(order.id)}`, 20, yPosition);
      const dateText = `Ngay lap: ${orderDate}`;
      const dateWidth = this.doc.getTextWidth(dateText);
      this.doc.text(dateText, width - 20 - dateWidth, yPosition);
      
      // Customer info section
      yPosition += 20;
      this.doc.setFont("times", "bold");
      this.doc.setFontSize(12);
      this.doc.text(this.removeVietnameseAccents("THONG TIN KHACH HANG"), 20, yPosition);
      
      yPosition += 8;
      this.doc.setFont("times", "normal");
      this.doc.setFontSize(10);
      
      // Safely get customer info - data is directly in order object
      const customerName = order.user_name || "Khach le";
      const phone = order.phone_number || 'N/A';
      const email = order.email || 'N/A';
      
      // Remove accents from customer info
      const cleanCustomerName = this.removeVietnameseAccents(customerName || "Khach le");
      
      this.doc.text(`Khach hang: ${cleanCustomerName}`, 20, yPosition);
      yPosition += 6;
      this.doc.text(`Dien thoai: ${phone}`, 20, yPosition);
      yPosition += 6;
      this.doc.text(`Email: ${email}`, 20, yPosition);
      
      // Order details section
      yPosition += 15;
      this.doc.setFont("times", "bold");
      this.doc.setFontSize(12);
      this.doc.text(this.removeVietnameseAccents("THONG TIN DON HANG"), 20, yPosition);
      
      yPosition += 8;
      this.doc.setFont("times", "normal");
      this.doc.setFontSize(10);
      
      // Status and payment info
      const statusMap = {
        'pending': 'Cho xac nhan',
        'waiting_for_pickup': 'Cho lay hang',
        'shipping': 'Dang giao hang', 
        'delivered': 'Da giao',
        'canceled': 'Da huy'
      };
      const paymentMap = {
        'cod': 'Thanh toan khi nhan',
        'vnpay': 'VNPay'
      };
      
      this.doc.text(`Trang thai: ${statusMap[order.status] || order.status}`, 20, yPosition);
      yPosition += 6;
      this.doc.text(`Phuong thuc thanh toan: ${paymentMap[order.paymentMethod] || order.paymentMethod}`, 20, yPosition);
      
      // Table header
      yPosition += 20;
      this.doc.setFillColor(33, 140, 33);
      this.doc.rect(20, yPosition - 10, width - 40, 10, 'F');
      
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFont("times", "bold");
      this.doc.setFontSize(10);
      this.doc.text("STT", 25, yPosition - 6);
      this.doc.text("Ten thuoc", 40, yPosition - 6);
      this.doc.text("SL", 120, yPosition - 6);
      this.doc.text("Don gia", 135, yPosition - 6);
      this.doc.text("Thanh tien", 165, yPosition - 6);
      
      // Table content
      yPosition += 5;
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFont("times", "normal");
      this.doc.setFontSize(9);
      
      let subtotal = 0;
      
      // Handle different order details structure
      const orderDetails = Array.isArray(order.details) ? order.details : 
                           (order.orderdetail_set ? order.orderdetail_set : []);
      
      orderDetails.forEach((item, index) => {
        
        if (yPosition > height - 50) { // New page if needed
          this.doc.addPage();
          yPosition = 50;
        }
        
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        // Alternating row colors
        if (index % 2 === 0) {
          this.doc.setFillColor(247, 247, 247);
          this.doc.rect(20, yPosition - 4, width - 40, 10, 'F');
        }
        
        this.doc.setTextColor(0, 0, 0);
        this.doc.text(`${index + 1}`, 25, yPosition);
        
        // Remove accents from medicine name - use medicine_name field directly
        let medicineName = item.medicine_name || item.medicine?.name || item.product?.name || "San pham";
        medicineName = this.removeVietnameseAccents(medicineName);
        if (medicineName.length > 40) {
          medicineName = medicineName.substring(0, 37) + "...";
        }
        this.doc.text(medicineName, 40, yPosition);
        
        this.doc.text(`${item.quantity}`, 122, yPosition);
        
        const priceText = `${parseInt(item.price).toLocaleString('vi-VN')} VND`;
        const priceWidth = this.doc.getTextWidth(priceText);
        this.doc.text(priceText, 155 - priceWidth, yPosition);
        
        const totalText = `${parseInt(itemTotal).toLocaleString('vi-VN')} VND`;
        const totalWidth = this.doc.getTextWidth(totalText);
        this.doc.text(totalText, 185 - totalWidth, yPosition);
        
        yPosition += 10;
      });
      
      // Summary section - match table width (20mm to width-20mm)
      yPosition += 15;
      
      // Summary background rectangle
      this.doc.setFillColor(242, 242, 242);
      this.doc.rect(20, yPosition, width - 40, 25, 'F');
      
      // Summary content
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFont("times", "normal");
      this.doc.setFontSize(10);
      
      // Subtotal line
      yPosition += 8;
      this.doc.text("Tam tinh:", 25, yPosition);
      const subtotalText = `${parseInt(subtotal).toLocaleString('vi-VN')} VND`;
      const subtotalWidth = this.doc.getTextWidth(subtotalText);
      this.doc.text(subtotalText, width - 25 - subtotalWidth, yPosition);
      
      // Shipping fee line
      yPosition += 6;
      const shippingFee = order.online_order?.shipping_method === 'home_delivery' ? 22000 : 0;
      this.doc.text("Phi van chuyen:", 25, yPosition);
      const shippingText = shippingFee === 0 ? "Mien phi" : `${shippingFee.toLocaleString('vi-VN')} VND`;
      const shippingWidth = this.doc.getTextWidth(shippingText);
      this.doc.text(shippingText, width - 25 - shippingWidth, yPosition);
      
      // Total line with bold font and green color
      yPosition += 10;
      this.doc.setFont("times", "bold");
      this.doc.setFontSize(12);
      this.doc.setTextColor(33, 140, 33);
      this.doc.text("TONG CONG:", 25, yPosition);
      const totalText = `${parseInt(order.total).toLocaleString('vi-VN')} VND`;
      const totalWidth = this.doc.getTextWidth(totalText);
      this.doc.text(totalText, width - 25 - totalWidth, yPosition);
      
      // Footer with signature
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFont("times", "normal");
      this.doc.setFontSize(10);
      const signatureY = height - 50;
      const currentDate = order.createdAt ? 
        new Date(order.createdAt).toLocaleDateString('vi-VN') : 
        (order.date ? new Date(order.date).toLocaleDateString('vi-VN') : 
         new Date().toLocaleDateString('vi-VN'));
      const footerDateWidth = this.doc.getTextWidth(currentDate);
      this.doc.text(currentDate, (width - footerDateWidth) / 2, signatureY);
      
      this.doc.text("Nguoi ban hang", 40, signatureY + 15);
      const customerTextWidth = this.doc.getTextWidth("Khach hang");
      this.doc.text("Khach hang", width - 40 - customerTextWidth, signatureY + 15);
      
      // Footer message
      this.doc.setTextColor(128, 128, 128);
      this.doc.setFont("times", "italic");
      this.doc.setFontSize(9);
      const thankMsg = this.removeVietnameseAccents("Cam on quy khach da tin tuong va su dung dich vu cua chung toi!");
      const thankWidth = this.doc.getTextWidth(thankMsg);
      this.doc.text(thankMsg, (width - thankWidth) / 2, height - 25);
      
      const contactMsg = this.removeVietnameseAccents("Moi thac mac xin lien he: 1800 6821 | nhathuocgiaphuc.com");
      const contactMsgWidth = this.doc.getTextWidth(contactMsg);
      this.doc.text(contactMsg, (width - contactMsgWidth) / 2, height - 20);
      
      // Save PDF
      const fileName = `hoa-don-${order.id}.pdf`;
      this.doc.save(fileName);
      
      return { success: true, message: 'Xuất hóa đơn thành công' };
      
    } catch (error) {
      console.error('PDF Export Error:', error);
      return { success: false, message: error.message || 'Lỗi xuất hóa đơn' };
    }
  }
}

const pdfExportService = new PDFExportService();
export default pdfExportService;
