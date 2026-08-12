import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Contact from './models/Contact.js';
import Booking from './models/Booking.js';
import GiftCard from './models/GiftCard.js';
import Newsletter from './models/Newsletter.js';
import Service from './models/Service.js';
import Pricing from './models/Pricing.js';
import User from './models/User.js';

dotenv.config();

/**
 * Seed tài khoản demo: Admin + Customer (chỉ chạy nếu chưa có)
 */
export const seedDemoUsers = async () => {
  const adminEmail = 'admin@tlaundry.com';
  const customerEmail = 'customer@tlaundry.com';

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: 'Admin TLaundry',
      email: adminEmail,
      password: 'admin123456',
      phone: '0901111111',
      role: 'ADMIN'
    });
    console.log('🌱 Seeded demo ADMIN account: admin@tlaundry.com / admin123456');
  }

  const existingCustomer = await User.findOne({ email: customerEmail });
  if (!existingCustomer) {
    await User.create({
      name: 'Nguyễn Văn Demo',
      email: customerEmail,
      password: 'customer123',
      phone: '0909999999',
      role: 'CUSTOMER'
    });
    console.log('🌱 Seeded demo CUSTOMER account: customer@tlaundry.com / customer123');
  }
};



export const seedServicesAndPricing = async () => {
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    console.log('🌱 Seeding initial Services into MongoDB...');
    await Service.insertMany([
      {
        serviceId: 'domestic',
        nameVi: 'Giặt Ủi Gia Đình',
        nameEn: 'Domestic Laundry',
        descVi: 'Dịch vụ giặt ủi gia đình hoàn hảo cho nhu cầu quần áo hàng ngày. Chúng tôi nhận hàng, giặt, sấy và gấp quần áo gọn gàng với nước giặt thân thiện môi trường. Trả hàng sạch thơm trong 24 giờ.',
        descEn: 'Our domestic laundry service is perfect for everyday household washing. We pick up, wash, dry and fold your clothes with care, using eco-friendly detergents. Delivered fresh within 24 hours.',
        img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
        featuresVi: ['Giặt, sấy & gấp gọn', 'Sản phẩm thân thiện môi trường', 'Trả hàng trong 24 giờ', 'Giao & nhận hàng miễn phí'],
        featuresEn: ['Wash, dry & fold', 'Eco-friendly products', '24-hour turnaround', 'Free pick-up & delivery'],
        iconType: 'domestic',
        order: 1
      },
      {
        serviceId: 'commercial',
        nameVi: 'Giặt Ủi Thương Mại',
        nameEn: 'Commercial Laundry',
        descVi: 'Dịch vụ giặt ủi chuyên nghiệp cho doanh nghiệp, nhà hàng, khách sạn và văn phòng. Xử lý số lượng lớn với chất lượng đồng nhất và đáng tin cậy. Có lịch nhận hàng định kỳ.',
        descEn: 'Professional laundry services for businesses, restaurants, hotels and offices. We handle large volumes with consistent quality and reliability. Regular scheduling available.',
        img: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=400&q=80',
        featuresVi: ['Khả năng xử lý số lượng lớn', 'Hẹn lịch định kỳ linh hoạt', 'Quy trình giặt chuẩn thương mại', 'Thời gian nhận hàng linh hoạt'],
        featuresEn: ['High-volume capacity', 'Regular scheduling', 'Commercial-grade cleaning', 'Flexible pick-up times'],
        iconType: 'commercial',
        order: 2
      },
      {
        serviceId: 'ironing',
        nameVi: 'Dịch Vụ Là/Ủi Quần Áo',
        nameEn: 'Ironing Services',
        descVi: 'Dịch vụ là/ủi hơi nước chuyên nghiệp giúp quần áo của bạn luôn phẳng phiu, chỉn chu. Phù hợp cho áo sơ mi công sở, quần tây, đầm dạ hội và trang phục cao cấp.',
        descEn: 'Professional ironing service to keep your clothes looking immaculate. Perfect for business shirts, blouses, trousers and more. Returned neatly pressed and ready to wear.',
        img: 'https://images.unsplash.com/photo-1616587226960-4a03badbe8bf?w=400&q=80',
        featuresVi: ['Ủi hơi nước chuyên nghiệp', 'Áo sơ mi & áo kiểu', 'Bộ vest & quần tây', 'Đầm & trang phục dạ hội'],
        featuresEn: ['Professional steam ironing', 'Shirts & blouses', 'Suits & trousers', 'Dresses & formalwear'],
        iconType: 'ironing',
        order: 3
      },
      {
        serviceId: 'drycleaning',
        nameVi: 'Giặt Khô / Giặt Hấp',
        nameEn: 'Dry Cleaning',
        descVi: 'Giặt khô chuyên sâu cho trang phục cao cấp đòi hỏi sự chăm sóc đặc biệt như veston, áo cưới, đồ lụa, dạ. Bảo vệ sợi vải tối đa.',
        descEn: 'Expert dry cleaning for delicate garments that require specialist care. Suits, formal wear, wedding dresses and more. Treated with the utmost care and attention.',
        img: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&q=80',
        featuresVi: ['Chăm sóc trang phục cao cấp', 'Bộ vest & trang phục trang trọng', 'Giặt hấp váy cưới', 'Chất liệu vải nhạy cảm'],
        featuresEn: ['Specialist garment care', 'Suits & formal wear', 'Wedding dress cleaning', 'Delicate fabrics'],
        iconType: 'drycleaning',
        order: 4
      }
    ]);
    console.log('✅ Services seeded successfully!');
  }

  const pricingCount = await Pricing.countDocuments();
  if (pricingCount === 0) {
    console.log('🌱 Seeding initial Pricing into MongoDB...');
    await Pricing.create({
      plans: [
        {
          planId: 'plan-domestic',
          nameVi: 'Giặt Ủi Gia Đình',
          nameEn: 'Domestic Laundry',
          noteVi: 'Giá tính theo trọng lượng — gọi cho chúng tôi để có báo giá chính xác theo số lượng đồ của bạn.',
          noteEn: 'Prices based on weight — call us for an exact quote based on your load size.',
          featured: false,
          featuresVi: [
            'Dịch vụ giặt, sấy & gấp gọn',
            'Giao & nhận hàng miễn phí',
            'Nước giặt thân thiện môi trường',
            'Trả hàng trong 24 giờ',
            'Phân loại & xếp gọn gàng',
            'Có dịch vụ đặt lịch định kỳ'
          ],
          featuresEn: [
            'Wash, dry & fold service',
            'Free pick-up & delivery',
            'Eco-friendly detergents',
            '24-hour turnaround',
            'Sorted & returned neatly',
            'Regular scheduling available'
          ],
          iconType: 'domestic',
          order: 1
        },
        {
          planId: 'plan-ironing-dryclean',
          nameVi: 'Là/Ủi & Giặt Khô Hấp',
          nameEn: 'Ironing & Dry Cleaning',
          noteVi: 'Tính giá theo từng món. Có ưu đãi giảm giá khi giặt từ 10 món trở lên. Liên hệ để nhận báo giá.',
          noteEn: 'Per-item pricing available. Bundle discounts for 10+ items. Contact us for a custom quote.',
          featured: true,
          featuresVi: [
            'Là/ủi hơi nước chuyên nghiệp',
            'Áo sơ mi chỉ từ $4/cái',
            'Bộ vest/suit từ $25/bộ',
            'Giao & nhận hàng miễn phí',
            'Có dịch vụ lấy nhanh trong ngày',
            'Bảo hành chất lượng từ TLaundry'
          ],
          featuresEn: [
            'Professional steam ironing',
            'Business shirts from $4 each',
            'Suits from $25 per set',
            'Free pick-up & delivery',
            'Same-day service available',
            'TLaundry Work Guarantee'
          ],
          iconType: 'drycleaning',
          order: 2
        },
        {
          planId: 'plan-commercial',
          nameVi: 'Dịch Vụ Thương Mại',
          nameEn: 'Commercial Services',
          noteVi: 'Mức giá thiết kế riêng cho doanh nghiệp. Giảm giá theo số lượng cho hợp đồng dài hạn.',
          noteEn: 'Tailored pricing for businesses. Volume discounts for regular bookings.',
          featured: false,
          featuresVi: [
            'Báo giá riêng theo khối lượng',
            'Lịch giao nhận định kỳ linh hoạt',
            'Khả năng xử lý số lượng cực lớn',
            'Quản lý tài khoản hỗ trợ riêng',
            'Ưu tiên xử lý nhanh nhất',
            'Có xuất hóa đơn doanh nghiệp'
          ],
          featuresEn: [
            'Custom commercial pricing',
            'Regular scheduling',
            'High-volume capacity',
            'Dedicated account manager',
            'Priority turnaround',
            'Invoicing available'
          ],
          iconType: 'commercial',
          order: 3
        }
      ],
      additionalItems: [
        { itemId: 'item-1', nameVi: 'Chăn Doona (Đơn)', nameEn: 'Doona (Single)', priceVi: 'Từ $25', priceEn: 'From $25', order: 1 },
        { itemId: 'item-2', nameVi: 'Chăn Doona (Đôi/Queen)', nameEn: 'Doona (Double/Queen)', priceVi: 'Từ $35', priceEn: 'From $35', order: 2 },
        { itemId: 'item-3', nameVi: 'Chăn Doona (King)', nameEn: 'Doona (King)', priceVi: 'Từ $45', priceEn: 'From $45', order: 3 },
        { itemId: 'item-4', nameVi: 'Gối (mỗi chiếc)', nameEn: 'Pillows (each)', priceVi: 'Từ $12', priceEn: 'From $12', order: 4 },
        { itemId: 'item-5', nameVi: 'Mền / Chăn bông', nameEn: 'Blanket', priceVi: 'Từ $20', priceEn: 'From $20', order: 5 },
        { itemId: 'item-6', nameVi: 'Túi ngủ', nameEn: 'Sleeping Bag', priceVi: 'Từ $30', priceEn: 'From $30', order: 6 },
        { itemId: 'item-7', nameVi: 'Thảm nhỏ', nameEn: 'Rug (Small)', priceVi: 'Từ $35', priceEn: 'From $35', order: 7 },
        { itemId: 'item-8', nameVi: 'Thảm lớn', nameEn: 'Rug (Large)', priceVi: 'Từ $55', priceEn: 'From $55', order: 8 },
        { itemId: 'item-9', nameVi: 'Rèm cửa (mỗi tấm)', nameEn: 'Curtains (per panel)', priceVi: 'Từ $18', priceEn: 'From $18', order: 9 },
        { itemId: 'item-10', nameVi: 'Đầm dạ hội', nameEn: 'Formal Dress', priceVi: 'Từ $35', priceEn: 'From $35', order: 10 },
        { itemId: 'item-11', nameVi: 'Bộ Vest (2 món)', nameEn: 'Suit (2-piece)', priceVi: 'Từ $25', priceEn: 'From $25', order: 11 },
        { itemId: 'item-12', nameVi: 'Váy cưới', nameEn: 'Wedding Dress', priceVi: 'Báo giá riêng', priceEn: 'POA', order: 12 }
      ]
    });
    console.log('✅ Pricing seeded successfully!');
  }
};

const runSeed = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing test data...');
    await Contact.deleteMany();
    await Booking.deleteMany();
    await GiftCard.deleteMany();
    await Newsletter.deleteMany();

    console.log('🌱 Inserting sample test data into MongoDB Atlas...');

    const sampleBooking = await Booking.create({
      orderCode: 'TL-BOK889922',
      customerName: 'Nguyễn Văn Thịnh',
      firstName: 'Nguyễn Văn',
      lastName: 'Thịnh',
      phone: '0988776655',
      email: 'thinh@example.com',
      address: '123 Đường Nguyễn Trãi, Quận 1',
      suburb: 'Quận 1',
      state: 'VIC',
      pickupDate: '2026-08-04',
      pickupTime: 'Sáng (8am-12pm)',
      serviceType: 'Giặt Ủi Gia Đình',
      totalAmount: 180000,
      status: 'PENDING',
      notes: 'Lấy đồ buổi sáng giùm tôi'
    });

    const sampleContact = await Contact.create({
      name: 'Trần Thị Tuấn',
      email: 'tuan@example.com',
      phone: '0912345678',
      subject: 'Hỏi về dịch vụ giặt rèm cửa',
      message: 'Shop có nhận giặt rèm cửa tận nhà không ạ? Giá tính theo kg hay m2?'
    });

    await seedServicesAndPricing();

    console.log('✅ Sample Booking created:', sampleBooking.orderCode);
    console.log('✅ Sample Contact created:', sampleContact._id);
    console.log('🎉 Data successfully inserted into database: tlaundry!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding test data:', error.message);
    process.exit(1);
  }
};

if (process.argv[1].includes('seedData.js')) {
  runSeed();
}
