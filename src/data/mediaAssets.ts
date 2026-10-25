// BK-IC Verified Media Assets Catalog (Mapped from bkic_media_manifest.json)

export interface MediaAsset {
  id: string;
  localUrl: string;
  originalUrl: string;
  title: string;
  caption: string;
  source: string;
  type: 'club_direct' | 'user_provided_facebook' | 'school_event' | 'institution_logo';
  status: 'verified_caption' | 'supplied_pending_review' | 'verified_school_event';
  aspect: string;
  recommendedPlacement: string[];
}

export const BKIC_MEDIA_ASSETS: Record<string, MediaAsset> = {
  bkic_logo: {
    id: 'bkic_logo',
    localUrl: '/images/bkic/bkic_logo.jpg',
    originalUrl: 'https://scontent.xx.fbcdn.net/v/t39.30808-6/667788334_2183010408771775_4567079815935505983_n.jpg?stp=dst-jpg_tt6&cstp=mx900x900&ctp=s900x900&_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHgzfj52V3gDIs-XigeHs1DMIqaB3chWp8wipoHdyFanzKkcSU1bwaCoOF_h1CVZz2egymiPVQTW772rLr-GKmL&_nc_ohc=wN7T8NWJwQ8Q7kNvwGd2ezi&_nc_oc=AdpggA6LyeTe1ypR3XJlLPw2kxUoN5xBLihtUxwtAqYAPTu6DHX1dgwzsRoUxMyL058&_nc_zt=23&_nc_ht=scontent.xx&_nc_gid=Wi3gmIAYX_NTYg-3kE7Y8w&_nc_ss=7b2a8&oh=00_AQOvfB-tXXSw0FonpO4w6v-3kq4vCLBHHFx0DMXS1X9S7g&oe=6ADD2C5C',
    title: 'Logo chính thức BK-IC',
    caption: 'Logo biểu trưng chính thức của Câu lạc bộ Khởi nghiệp và Đổi mới sáng tạo - Bách Khoa Innovation Club',
    source: 'Fanpage BK-IC Chính thức (facebook.com/dut.bkic)',
    type: 'club_direct',
    status: 'verified_caption',
    aspect: 'aspect-square',
    recommendedPlacement: ['navbar', 'header', 'footer']
  },
  bkic_launch: {
    id: 'bkic_launch',
    localUrl: '/images/bkic/bkic_launch.jpg',
    originalUrl: 'https://bqn.1cdn.vn/2026/04/02/636631392_122101807857262466_6002437190120450416_n%281%29.jpg',
    title: 'Lễ ra mắt BK-IC',
    caption: 'Ra mắt Câu lạc bộ Khởi nghiệp và Đổi mới sáng tạo – Bách Khoa Innovation Club',
    source: 'Báo Đà Nẵng (04/04/2026)',
    type: 'club_direct',
    status: 'verified_caption',
    aspect: 'aspect-16/10',
    recommendedPlacement: ['about', 'milestones']
  },
  dut_emblem: {
    id: 'dut_emblem',
    localUrl: '/images/bkic/dut_emblem.jpg',
    originalUrl: 'https://en.dut.udn.vn/uploads/2022/04/19/0230237d11b749849f7bdfd5e328d97f.jpg',
    title: 'Biểu trưng Trường Đại học Bách khoa – ĐHĐN',
    caption: 'Biểu trưng chính thức của Trường Đại học Bách khoa, Đại học Đà Nẵng',
    source: 'DUT Portal',
    type: 'institution_logo',
    status: 'verified_caption',
    aspect: 'aspect-square',
    recommendedPlacement: ['affiliation', 'footer']
  },
  startup_training: {
    id: 'startup_training',
    localUrl: '/images/bkic/startup_training.jpg',
    originalUrl: 'https://bqn.1cdn.vn/2026/04/02/653758094_915236157814961_4871381803074366523_n.jpg',
    title: 'Tập huấn chuyên sâu mô hình kinh doanh tại DUT',
    caption: 'Buổi tập huấn mô hình kinh doanh và bài toán tài chính tại Trường Đại học Bách khoa',
    source: 'Báo Đà Nẵng (04/04/2026)',
    type: 'school_event',
    status: 'verified_school_event',
    aspect: 'aspect-16/9',
    recommendedPlacement: ['ecosystem_news']
  },
  bkshark_auditorium: {
    id: 'bkshark_auditorium',
    localUrl: '/images/bkic/bkshark_auditorium.jpg',
    originalUrl: 'https://startupdanang.vn/uploads/images/z7832188248277_85b01e06a99eca10c99c01b7528c30df.jpg',
    title: 'Toàn cảnh vòng chung kết BK SHARK 2026',
    caption: 'Toàn cảnh cuộc thi Khởi nghiệp sinh viên BK SHARK 2026 do Trường ĐH Bách khoa tổ chức (16/05/2026)',
    source: 'Trung tâm Hỗ trợ KNĐMST Đà Nẵng',
    type: 'school_event',
    status: 'verified_school_event',
    aspect: 'aspect-16/9',
    recommendedPlacement: ['ecosystem_news', 'gallery_school']
  },
  bkshark_ecosim_pitch: {
    id: 'bkshark_ecosim_pitch',
    localUrl: '/images/bkic/bkshark_ecosim_pitch.jpg',
    originalUrl: 'https://startupdanang.vn/uploads/images/z7832188259024_ccaad9dd61b32e106fa2f3cdae44e878%281%29.jpg',
    title: 'Pitching dự án EcoSim tại BK SHARK 2026',
    caption: 'Thí sinh trình bày dự án EcoSim tại vòng chung kết BK SHARK 2026',
    source: 'Startup Đà Nẵng',
    type: 'school_event',
    status: 'verified_school_event',
    aspect: 'aspect-4/3',
    recommendedPlacement: ['ecosystem_news', 'gallery_school']
  },
  bkshark_danangbooth: {
    id: 'bkshark_danangbooth',
    localUrl: '/images/bkic/bkshark_danangbooth.jpg',
    originalUrl: 'https://startupdanang.vn/uploads/images/z7832202138653_68dc5261e114d24eb08575bd3c38d7d9%281%29.jpg',
    title: 'Pitching dự án DanangBooth',
    caption: 'Phần giới thiệu dự án DanangBooth tại BK SHARK 2026',
    source: 'Startup Đà Nẵng',
    type: 'school_event',
    status: 'verified_school_event',
    aspect: 'aspect-4/3',
    recommendedPlacement: ['ecosystem_news', 'gallery_school']
  },
  bkdn_students: {
    id: 'bkdn_students',
    localUrl: '/images/bkic/bkdn_students.jpg',
    originalUrl: 'https://dut.udn.vn/Files/admin/images/Tin_tuc/KHCN_HTQT/2026/BKDN2026/image028.jpg',
    title: 'Sinh viên tham dự Ngày hội BKĐN 2026',
    caption: 'Sinh viên tại ngày hội khoa học công nghệ, khởi nghiệp và đổi mới sáng tạo BKĐN 2026',
    source: 'Cổng thông tin DUT',
    type: 'school_event',
    status: 'verified_school_event',
    aspect: 'aspect-16/10',
    recommendedPlacement: ['ecosystem_news', 'gallery_school']
  },
  bkdn_awards: {
    id: 'bkdn_awards',
    localUrl: '/images/bkic/bkdn_awards.jpg',
    originalUrl: 'https://dut.udn.vn/Files/admin/images/Tin_tuc/KHCN_HTQT/2026/BKDN2026_Bemac/image030.jpg',
    title: 'Hình ảnh trao giải BKĐN 2026',
    caption: 'Hoạt động trao giải vinh danh các ý tưởng sáng tạo tại BKĐN 2026',
    source: 'Cổng thông tin DUT',
    type: 'school_event',
    status: 'verified_school_event',
    aspect: 'aspect-16/10',
    recommendedPlacement: ['ecosystem_news', 'gallery_school']
  },
  // 5 Facebook user-provided photos from fanpage https://www.facebook.com/dut.bkic
  bkic_facebook_user_01: {
    id: 'bkic_facebook_user_01',
    localUrl: '/images/bkic/bkic_facebook_user_01.jpg',
    originalUrl: 'https://scontent.fdad3-1.fna.fbcdn.net/v/t39.30808-6/802031217_1349843447135219_1383487086818080411_n.jpg?stp=cp6_dst-jpegr_tt6&cstp=mx2048x1153&ctp=s2048x1153&_nc_cat=102&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeF7IBEFajKAQ9vjXU9xtmrddh5lep_rPH12HmV6n-s8fW24G2U46qoARLQkVILlAZ2-fsC0bI9d94mKjFamCTqd&_nc_ohc=n91J45kfRZcQ7kNvwErTN7g&_nc_oc=AdrQ4-4mlKy2wLJEsbl-sZELz-nq5VzpTHkQotLWKgs0O-8kfF-O4Sh68_XCbeun4c4&_nc_zt=23&se=-1&_nc_ht=scontent.fdad3-1.fna&_nc_gid=q-IiD_VOR63xUFINeoQV-Q&_nc_ss=7b2a8&oh=00_AQMQPVptPQnLGmL6_0DXHehpXP-U0-VrUevCyhhe3JTrMA&oe=6ADD2EC4',
    title: 'Khoảnh khắc sinh hoạt & Gắn kết BK-IC #01',
    caption: 'Hình ảnh hoạt động cộng đồng sinh viên tại Câu lạc bộ Khởi nghiệp và Đổi mới sáng tạo BK-IC',
    source: 'Fanpage BK-IC (facebook.com/dut.bkic)',
    type: 'user_provided_facebook',
    status: 'supplied_pending_review',
    aspect: 'aspect-16/9',
    recommendedPlacement: ['hero', 'gallery']
  },
  bkic_facebook_user_02: {
    id: 'bkic_facebook_user_02',
    localUrl: '/images/bkic/bkic_facebook_user_02.jpg',
    originalUrl: 'https://scontent.fdad3-8.fna.fbcdn.net/v/t39.30808-6/662018656_122100792446846201_1885544827712934568_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1365&ctp=s2048x1365&_nc_cat=106&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGVsfckzUhNPUHcD8dXnMp2NiaDlVLz15A2JoOVUvPXkL55ZtbsguLpDyxQZus7Vue7yedif-FnepKTOzMnEzCA&_nc_ohc=d10ZVCsFbsEQ7kNvwGQp9H1&_nc_oc=AdolxU_aHeVoAvhPvwwRxfzGrstb4YaW4fedPjrpiGmBa11Msl7704nfio_-g-9t_Pc&_nc_zt=23&_nc_ht=scontent.fdad3-8.fna&_nc_gid=Ml7lfIUdLg8mOj7JIascmw&_nc_ss=7b2a8&oh=00_AQMzugmwXhtoVmHVppXccMrjMWiZCDXNQdOGxjhfZsHHQQ&oe=6ADD21DA',
    title: 'Thành viên BK-IC trong buổi làm việc nhóm',
    caption: 'Không gian cộng tác và ươm tạo giải pháp của các bạn sinh viên Bách khoa',
    source: 'Fanpage BK-IC (facebook.com/dut.bkic)',
    type: 'user_provided_facebook',
    status: 'supplied_pending_review',
    aspect: 'aspect-3/2',
    recommendedPlacement: ['about', 'gallery']
  },
  bkic_facebook_user_03: {
    id: 'bkic_facebook_user_03',
    localUrl: '/images/bkic/bkic_facebook_user_03.jpg',
    originalUrl: 'https://scontent.fdad3-1.fna.fbcdn.net/v/t39.30808-6/802652593_1349841870468710_5395595228171900309_n.jpg?stp=cp6_dst-jpegr_tt6&cstp=mx2048x1153&ctp=s2048x1153&_nc_cat=104&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGmybMQ3nm61QhK6Rtfcwe-IuWWrio0v3ci5ZauKjS_d-GjDxMEM-lUAg-Qxm4BGNeIbM4U7QGiCq_1YqgPA3PG&_nc_ohc=vUIJy-Sw4wkQ7kNvwGCbHSI&_nc_oc=Adq4CkNijmluuCRqm6pNAQqMiMACOXS8YRN3g0bHFnUxTjxu--5JO0gpfafyU031lW8&_nc_zt=23&se=-1&_nc_ht=scontent.fdad3-1.fna&_nc_gid=umbcsawr5jVOXseUojwPOA&_nc_ss=7b2a8&oh=00_AQMRZ0XGQY-Zl4ThvLfjs4smAQtsklzMXkcBWXUSknGGyA&oe=6ADD2CF5',
    title: 'Hoạt động chuyên đề & Thảo luận dự án',
    caption: 'Những buổi chia sẻ kinh nghiệm kỹ thuật và phát triển sản phẩm công nghệ',
    source: 'Fanpage BK-IC (facebook.com/dut.bkic)',
    type: 'user_provided_facebook',
    status: 'supplied_pending_review',
    aspect: 'aspect-16/9',
    recommendedPlacement: ['activities', 'gallery']
  },
  bkic_facebook_user_04: {
    id: 'bkic_facebook_user_04',
    localUrl: '/images/bkic/bkic_facebook_user_04.jpg',
    originalUrl: 'https://scontent.fdad3-8.fna.fbcdn.net/v/t39.30808-6/782144924_122123228456846201_8313471059115138297_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1536&ctp=s2048x1536&_nc_cat=106&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHA1hfk71BCHwWSOfrjQaTp22eVVtqA-ZbbZ5VW2oD5lmOPXU0LAuafKGnzYZv7vugRC3V_6XwKfIqH9m3YNh6i&_nc_ohc=wwBzJN0MTTEQ7kNvwEcAH3R&_nc_oc=AdrARAQ3Zpz6l4eDUsR1j39Sxth2Rzc95dc-4Z8SBran4hs34q4IEZpLEBBzZuFGJn8&_nc_zt=23&_nc_ht=scontent.fdad3-8.fna&_nc_gid=O83eYV2D7TWIqwJX0bSDnA&_nc_ss=7b2a8&oh=00_AQM8W0EqeYhKiYsbeORmq2VoOkrx28jo7QWCkFP_xeaZwA&oe=6ADD3F47',
    title: 'Buổi tập huấn & Trải nghiệm thực tế',
    caption: 'Ghi nhận khoảnh khắc các thành viên tham gia hoạt động rèn luyện kỹ năng',
    source: 'Fanpage BK-IC (facebook.com/dut.bkic)',
    type: 'user_provided_facebook',
    status: 'supplied_pending_review',
    aspect: 'aspect-4/3',
    recommendedPlacement: ['gallery']
  },
  bkic_facebook_user_05: {
    id: 'bkic_facebook_user_05',
    localUrl: '/images/bkic/bkic_facebook_user_05.jpg',
    originalUrl: 'https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-6/800958825_122125765400846201_8142015197040621142_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1536&ctp=s2048x1536&_nc_cat=104&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEJd7WyexnU-Oj_rG5BcjUUHoW20RZP8lgehbbRFk_yWCbpbF3T5gjz5L_TAwrl0-Ml32tkvtVySQTVixI5vtsH&_nc_ohc=NvpDoXqkxRwQ7kNvwGpcMBq&_nc_oc=AdpMz4hSHNkS7owciBTvuH1YLNV_xsCcCkao7-diuuwcHZ6TQDM7EPIEddOVfn8c83k&_nc_zt=23&_nc_ht=scontent.fdad3-4.fna&_nc_gid=JFNZKFM2fHtSdFpWKuFTaA&_nc_ss=7b2a8&oh=00_AQP18LPA76fa4MFrPrzHJCNn9RlPgoBi6c7epaseeyysbQ&oe=6ADD1B61',
    title: 'Khoảnh khắc đồng đội BK-IC',
    caption: 'Tình bạn, sự gắn kết và tinh thần sẵn sàng học hỏi của thế hệ trẻ Bách khoa',
    source: 'Fanpage BK-IC (facebook.com/dut.bkic)',
    type: 'user_provided_facebook',
    status: 'supplied_pending_review',
    aspect: 'aspect-4/3',
    recommendedPlacement: ['gallery', 'community']
  }
};
