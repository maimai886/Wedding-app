import style from "./myPicture.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
// import required modules
import { EffectCoverflow, Pagination } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import { useEffect, useState } from "react";
import { getFileListApi } from "../../request";
import { FileListData } from "../Information/information.interface";
import useLoading from "../../hook/useLoading";

const MyPicture = () => {
  /**
   * 状態定義
   */
  //ユーザーinfo
  const userInfo = {
    userName: localStorage.getItem("userName"),
    sqlNo: localStorage.getItem("sqlNo"),
  };

  //loadingModel
  const loading = useLoading();

  //filelist取得
  const [fileList, setFileList] = useState<FileListData[]>([]);

  /**
   * 関数定義
   */
  //filelist取得
  async function getFileList(): Promise<void> {
    if (userInfo.sqlNo == null || userInfo.sqlNo == "") {
      return;
    }
    loading.open();
    const param = { ...userInfo };
    let result = await getFileListApi(param);
    if (result.code == 0) {
      setFileList(result.fileList);
    }
    loading.close();
  }
  /**
   * 監視定義
   */
  useEffect(() => {
    getFileList();
  }, []);
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
            {fileList ? (
              fileList.map((item) => (
                <SwiperSlide className={`${style.swiperSlide}`}>
                  <img
                    src={`data:image/png;base64,${item.imgData}`}
                    alt="無法顯示"
                  />
                </SwiperSlide>
              ))
            ) : (
              <div>
                <img src="/D://img//f07105969dbc5f2c1f626cf3a01e285e.png" />
              </div>
            )}
          </Swiper>
        </section>
      }
    </div>
  );
};

export default MyPicture;
