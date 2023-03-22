import style from "./information.module.scss";
import { ReactComponent as Upload } from "../../assets/svgs/uploadMark.svg";
import { ReactComponent as Write } from "../../assets/svgs/writeMark.svg";
import { ReactComponent as Box } from "../../assets/svgs/boxMark.svg";
import together from "../../assets/img/together.jpg";
import sara from "../../assets/img/sara.jpg";
import wu from "../../assets/img/wu.jpg";
import { useEffect, useState, useRef, useCallback } from "react";
import moment from "moment";

import { Swiper, SwiperSlide } from "swiper/react";
// import required modules
import { EffectCoverflow, Pagination } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import WriteModel from "../../components/WriteModel/WriteModel";
import UploadModel from "../../components/UploadModel/UploadModel";
import { FileListData } from "./information.interface";

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

  //fileList
  const [fileList, setFileList] = useState<FileListData[]>([]);

  return (
    <div className={`${style.main} ${isScroll && style.fixed}`}>
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
                setFileList={(e: any) => {
                  setFileList(() => {
                    console.log("fileList", e);
                    return e;
                  });
                }}
                handleMenu={() => props.handleMenu("mypicture")}
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
            {fileList.length > 0 ? (
              fileList.map((item) => (
                <div className={style.filesTableRow} key={item.fileName}>
                  <div
                    className={`${style.tableCell} ${style.nameCell} ${style.png}`}
                  >
                    {item.originalName}
                  </div>
                  <div className={style.tableCell}>
                    {moment(item.updateTime).format("MM-DD HH:ss")}
                  </div>
                  <div className={`${style.tableCell} ${style.actionCell}`}>
                    <button className={style.moreAction}></button>
                  </div>
                </div>
              ))
            ) : (
              <div className={style.nofile}>
                <Box />
                no data
              </div>
            )}
          </div>
        </section>
      }
    </div>
  );
};

export default Information;
