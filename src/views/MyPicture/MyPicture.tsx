import style from "./myPicture.module.scss";
import { ReactComponent as SearchButton } from "../../assets/svgs/searchMark.svg";
import { ReactComponent as Maximize } from "../../assets/svgs/maximizeMark.svg";

const MyPicture = () => {
  return (
    <div className={`${style.main}`}>
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
        //圖片區

        <section className={style.contentSection}>
          <div className={style.contentSectionLine}>
            <div className={`${style.sectionPart}  ${style.left}`}>
              <a className={style.imageWrapper}>
                <div className={style.imageOverlay}>
                  <div className={style.videoInfo}>
                    <div className={style.videoInfoText}>
                      <p className={`${style.videoName} ${style.medium}`}>
                        Happiness & Tears
                      </p>
                    </div>
                    <Maximize className={style.maximize} />
                  </div>
                </div>
                <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2251&q=80" />
              </a>
            </div>
          </div>

          <div className={style.contentSectionLine}>
            <div className={`${style.sectionPart} ${style.left}`}>
              <a className={style.imageWrapper}>
                <div className={style.imageOverlay}>
                  <div className={style.videoInfo}>
                    <div className={style.videoInfoText}>
                      <p className={`${style.videoName} ${style.medium}`}>
                        Happiness & Tears
                      </p>
                    </div>
                    <Maximize className={style.maximize} />
                  </div>
                </div>
                <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2251&q=80" />
              </a>
            </div>
          </div>

          <div className={style.contentSectionLine}>
            <div className={`${style.sectionPart} ${style.left}`}>
              <a className={style.imageWrapper}>
                <div className={style.imageOverlay}>
                  <div className={style.videoInfo}>
                    <div className={style.videoInfoText}>
                      <p className={`${style.videoName} ${style.medium}`}>
                        Happiness & Tears
                      </p>
                    </div>
                    <Maximize className={style.maximize} />
                  </div>
                </div>
                <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2251&q=80" />
              </a>
            </div>
          </div>
        </section>
      }
    </div>
  );
};

export default MyPicture;
