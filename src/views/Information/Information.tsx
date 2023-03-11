import style from "./information.module.scss";
import { ReactComponent as SearchButton } from "../../assets/svgs/searchMark.svg";
import { ReactComponent as Upload } from "../../assets/svgs/uploadMark.svg";
import { ReactComponent as Write } from "../../assets/svgs/writeMark.svg";
import { ReactComponent as Maximize } from "../../assets/svgs/maximizeMark.svg";
import { useEffect, useState } from "react";

const Information = () => {
  /**
   * 状態定義
   */
  const [isScroll, setIsScroll] = useState<boolean>(false);
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
              <div className={style.accessIcon}>
                <Upload />
              </div>
              <span className={style.accessText}>上傳圖片</span>
            </div>

            <div className={style.accessLinkWrapper}>
              <div className={style.accessIcon}>
                <Write />
              </div>
              <span className={style.accessText}>寫下祝福</span>
            </div>
          </div>
        </section>
      }

      {
        //圖片影片區
        <section className={style.contentSection}>
          <div className={style.sectionHeaderWrapper}>
            <h1 className={style.sectionHeader}>預覽</h1>
            <a className={style.sectionHeaderLink}>更多</a>
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
            <div className={`${style.sectionPart} ${style.right}`}>
              <div className={style.contentPartLine}>
                <a className={style.imageWrapper}>
                  <div className={style.imageOverlay}>
                    <div className={style.videoInfo}>
                      <div className={style.videoInfoText}>
                        <p className={`${style.videoName} ${style.tiny}`}>
                          High Hopes
                        </p>
                      </div>
                      <Maximize className={style.maximize} />
                    </div>
                  </div>
                  <img src="https://images.unsplash.com/photo-1515552726023-7125c8d07fb3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2167&q=80" />
                </a>
                <a className={style.imageWrapper}>
                  <div className={style.imageOverlay}>
                    <div className={style.videoInfo}>
                      <div className={style.videoInfoText}>
                        <p className={`${style.videoName} ${style.tiny}`}>
                          Imaginery you
                        </p>
                      </div>
                      <Maximize className={style.maximize} />
                    </div>
                  </div>
                  <img src="https://images.unsplash.com/photo-1542359649-31e03cd4d909?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2167&q=80" />
                </a>
              </div>
            </div>
          </div>
        </section>
      }
    </div>
  );
};

export default Information;
