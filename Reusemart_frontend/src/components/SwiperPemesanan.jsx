import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const SwiperPemesanan = ({ selectedPemesanan, swiperRef }) => {

    if (!selectedPemesanan?.rincian_pemesanan?.length) {
        return <div>Loading barang...</div>;
    }

    return (
        <div style={{ padding: '0 10px' }}>
        <Swiper key={selectedPemesanan.id_pemesanan}
            ref={swiperRef}
            modules={[Navigation, Pagination]}
            observer={true}
            observeParents={true}
            spaceBetween={15}
            slidesPerView={1.5} 
            centeredSlides={false}
            navigation
            pagination={{ clickable: true }}
            onInit={(swiper) => swiper.update()} 
            breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 2.5 },
                1024: { slidesPerView: 3 },
            }}
        >
            {selectedPemesanan.rincian_pemesanan.map((item, index) => (
            <SwiperSlide key={index}>
                <div style={{
                border: '1px solid #eee',
                borderRadius: '8px',
                padding: '10px',
                height: '250px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
                }}>

                <img 
                    src={`http://127.0.0.1:8000/storage/foto_barang/${item.barang.foto_barang}`} 
                    alt={item.barang.nama_barang}
                    style={{
                    maxHeight: "150px",
                    maxWidth: "150px",
                    objectFit: 'contain',
                    marginBottom: '10px'
                    }} 
                />
                <h6 style={{ marginBottom: '10px' }}>{item.barang.nama_barang}</h6>
                </div>
            </SwiperSlide>
            ))}
        </Swiper>
        </div>
    );
};

export default SwiperPemesanan;