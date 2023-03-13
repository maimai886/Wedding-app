import style from "./information.module.scss";
import { ReactComponent as SearchButton } from "../../assets/svgs/searchMark.svg";
import { ReactComponent as Upload } from "../../assets/svgs/uploadMark.svg";
import { ReactComponent as Write } from "../../assets/svgs/writeMark.svg";
import together from "../../assets/img/together.jpg";
import sara from "../../assets/img/sara.jpg";
import wu from "../../assets/img/wu.jpg";
import { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
// import required modules
import { EffectCoverflow, Pagination } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import WriteModel from "../../components/WriteModel/WriteModel";
import UploadModel from "../../components/UploadModel/UploadModel";

interface InformationProps {
  handleMenu: React.Dispatch<React.SetStateAction<string>>;
}

const Information = (props: InformationProps) => {
  /**
   * 状態定義
   */
  const [isScroll, setIsScroll] = useState<boolean>(false);

  //imgUpload
  const [openUpload, setOpenUpload] = useState<boolean>(false);

  //imgUpload
  const [openWrite, setOpenWrite] = useState<boolean>(false);

  /**
   * 監視定義
   */
  useEffect(() => {}, []);

  return (
    <div className={`${style.main} ${isScroll && style.fixed}`}>
      {
        //頭部
        <div className={style.mainAreaHeader}>
          <div className={style.searchWrapper} id="searchLine">
            <input
              className={style.searchInput}
              type="text"
              placeholder="查詢已上傳圖片"
            />
            <SearchButton />
          </div>
        </div>
      }
      {
        //功能區
        <section className={style.contentSection}>
          <h1 className={style.sectionHeader}>操作</h1>
          <div className={style.accessLinks}>
            <div className={style.accessLinkWrapper}>
              <div
                className={style.accessIcon}
                onClick={() => setOpenUpload(true)}
              >
                <Upload />
              </div>
              <span className={style.accessText}>上傳圖片</span>
              <UploadModel
                openUpload={openUpload}
                setOpenUpload={setOpenUpload}
              />
            </div>

            <div className={style.accessLinkWrapper}>
              <div
                className={style.accessIcon}
                onClick={() => setOpenWrite(true)}
              >
                <Write />
              </div>
              <span className={style.accessText}>寫下祝福</span>
              <WriteModel openWrite={openWrite} setOpenWrite={setOpenWrite} />
            </div>
          </div>
        </section>
      }

      {
        //圖片區
        <section className={style.contentSection}>
          <div className={style.sectionHeaderWrapper}>
            <h1 className={style.sectionHeader}>About us</h1>
          </div>
          <div className={style.contentSectionLine}>
            <div className={`${style.left}`}>
              <a className={style.imageWrapper}>
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
                  onSwiper={(swiper) => console.log(swiper)}
                  onSlideChange={(e) => console.log("slide change", e)}
                >
                  <SwiperSlide className={`${style.swiperSlide}`}>
                    {({ isActive }) => (
                      <img
                        src={together}
                        className={`${!isActive && style.sildActive}`}
                      />
                    )}
                  </SwiperSlide>
                  <SwiperSlide className={style.swiperSlide}>
                    {({ isActive }) => (
                      <img
                        src={sara}
                        className={`${!isActive && style.sildActive}`}
                      />
                    )}
                  </SwiperSlide>
                  <SwiperSlide className={`${style.swiperSlide}`}>
                    {({ isActive }) => (
                      <img
                        src={wu}
                        className={`${!isActive && style.sildActive}`}
                      />
                    )}
                  </SwiperSlide>
                </Swiper>
              </a>
            </div>
          </div>
        </section>
      }
      {
        //檔案列表
        <section className={style.contentSection}>
          <div className={style.sectionHeaderWrapper}>
            <h1 className={style.sectionHeader}>已上傳</h1>
            <a
              className={style.sectionHeaderLink}
              onClick={() => props.handleMenu("mypicture")}
            >
              更多
            </a>
          </div>

          <div className={style.filesTable}>
            <div className={style.filesTableHeader}>
              <div className={`${style.columnHeader} ${style.tableCell}`}>
                檔名
              </div>
              <div className={`${style.columnHeader} ${style.tableCell}`}>
                上傳日期
              </div>
              <div className={`${style.columnHeader} ${style.tableCell}`}>
                操作
              </div>
            </div>
            <div className={style.filesTableRow}>
              <div
                className={`${style.tableCell} ${style.nameCell} ${style.pdf}`}
              >
                Test1.pdf
              </div>
              <div className={style.tableCell}>Aug 26, 2020</div>
              <div className={`${style.tableCell} ${style.actionCell}`}>
                <button className={style.moreAction}></button>
              </div>
            </div>
            <div className={style.filesTableRow}>
              <div
                className={`${style.tableCell} ${style.nameCell} ${style.jpg}`}
              >
                Test2.jpg
              </div>
              <div className={style.tableCell}>Aug 26, 2020</div>
              <div className={`${style.tableCell} ${style.actionCell}`}>
                <button className={style.moreAction}></button>
              </div>
            </div>
          </div>
        </section>
      }
    </div>
  );
};

export default Information;
