import style from "./myPicture.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
// import required modules
import { EffectCoverflow, Pagination } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

const MyPicture = () => {
  return (
    <div className={style.main}>
      {
        //功能區
        <section className={style.contentSection}>
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 20,
              stretch: 0,
              depth: 50,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={true}
            modules={[EffectCoverflow, Pagination]}
            className={style.mySwiper}
          >
            <SwiperSlide className={`${style.swiperSlide}`}>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTrMjaLnyOAvYiHouRP2zNBaZkTWma20x6aQ&usqp=CAU" />
            </SwiperSlide>
            <SwiperSlide className={style.swiperSlide}>
              <img src="https://swiperjs.com/demos/images/nature-2.jpg" />
            </SwiperSlide>
            <SwiperSlide className={`${style.swiperSlide}`}>
              <img src="https://swiperjs.com/demos/images/nature-3.jpg" />
            </SwiperSlide>
          </Swiper>
        </section>
      }
    </div>
  );
};

export default MyPicture;
