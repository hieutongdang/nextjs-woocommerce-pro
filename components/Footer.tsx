import Link from 'next/link';
import { 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaFacebookF, 
  FaInstagram, 
  FaYoutube, 
  FaTwitter,
  FaClock,
  FaShieldAlt,
  FaTruck,
  FaUndoAlt,
  FaHeadset
} from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Company Info */}
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center text-white font-bold">
                CN
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Cuanhua.com.vn
              </span>
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed">
              Chuyên cung cấp các sản phẩm chất lượng cao với dịch vụ khách hàng tận tâm. 
              Cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng.
            </p>

            {/* Service Features */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FaShieldAlt className="text-primary" size={12} />
                <span>Bảo hành chính hãng</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FaTruck className="text-primary" size={12} />
                <span>Giao hàng nhanh</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FaUndoAlt className="text-primary" size={12} />
                <span>Đổi trả 30 ngày</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FaHeadset className="text-primary" size={12} />
                <span>Hỗ trợ 24/7</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white relative">
              Liên kết nhanh
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/gioi-thieu" className="text-gray-400 hover:text-primary transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/san-pham" className="text-gray-400 hover:text-primary transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-primary transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Tin tức
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="text-gray-400 hover:text-primary transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white relative">
              Hỗ trợ khách hàng
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/chinh-sach-bao-hanh" className="text-gray-400 hover:text-primary transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-van-chuyen" className="text-gray-400 hover:text-primary transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-doi-tra" className="text-gray-400 hover:text-primary transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link href="/dieu-khoan-su-dung" className="text-gray-400 hover:text-primary transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-bao-mat" className="text-gray-400 hover:text-primary transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white relative">
              Thông tin liên hệ
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary rounded-full"></span>
            </h3>
            
            <div className="space-y-4">
              {/* Phone */}
              <a 
                href={`tel:${process.env.NEXT_PUBLIC_HOTLINE}`}
                className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors duration-200 group"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FaPhoneAlt size={12} className="text-primary" />
                </div>
                <span className="text-sm">{process.env.NEXT_PUBLIC_HOTLINE}</span>
              </a>

              {/* Email */}
              <a 
                href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
                className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors duration-200 group"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FaEnvelope size={12} className="text-primary" />
                </div>
                <span className="text-sm">{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</span>
              </a>

              {/* Address */}
              <div className="flex items-start gap-3 text-gray-400">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-0.5">
                  <FaMapMarkerAlt size={12} className="text-primary" />
                </div>
                <span className="text-sm leading-relaxed">
                  123 Đường ABC, Phường XYZ<br />
                  Quận 1, TP. Hồ Chí Minh
                </span>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-3 text-gray-400">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-0.5">
                  <FaClock size={12} className="text-primary" />
                </div>
                <span className="text-sm leading-relaxed">
                  T2 - T7: 8:00 - 18:00<br />
                  Chủ nhật: 9:00 - 17:00
                </span>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-sm font-medium text-white mb-3">Theo dõi chúng tôi</h4>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-200 group"
                >
                  <FaFacebookF size={12} className="text-primary group-hover:text-white" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-200 group"
                >
                  <FaInstagram size={12} className="text-primary group-hover:text-white" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-200 group"
                >
                  <FaYoutube size={12} className="text-primary group-hover:text-white" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-200 group"
                >
                  <FaTwitter size={12} className="text-primary group-hover:text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © {currentYear} <span className="text-primary font-medium">Cuanhua.com.vn</span>. Tất cả quyền được bảo lưu.
            </div>
            
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <span>Được thiết kế với ❤️ tại Việt Nam</span>
              <div className="flex items-center gap-1">
                <span className="w-4 h-3 bg-red-500 rounded-sm flex items-center justify-center text-white text-xs">🇻🇳</span>
                <span>Sản phẩm Việt Nam</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}