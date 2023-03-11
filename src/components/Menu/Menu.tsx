import style from "./Menu.module.scss";
import { useNavigate } from "react-router-dom";
import { ReactComponent as CancelButton } from "../../assets/svgs/cancleMark.svg";
import { ReactComponent as Home } from "../../assets/svgs/homeMark.svg";
import { ReactComponent as Picture } from "../../assets/svgs/pictureMark.svg";
import { ReactComponent as Rank } from "../../assets/svgs/rankMark.svg";
import { ReactComponent as Schedule } from "../../assets/svgs/scheduleMark.svg";
import { ReactComponent as Present } from "../../assets/svgs/presentMark.svg";
import { ReactComponent as File } from "../../assets/svgs/fileMark.svg";
import { ReactComponent as Logout } from "../../assets/svgs/logoutMark.svg";
import { ReactComponent as Download } from "../../assets/svgs/downloadMark.svg";
import { ReactComponent as Downloading } from "../../assets/svgs/downloadingMark.svg";
import { ReactComponent as Stop } from "../../assets/svgs/stopMark.svg";
import { ReactComponent as OpenRight } from "../../assets/svgs/rightMark.svg";
import { ReactComponent as OpenLeft } from "../../assets/svgs/leftMark.svg";
import { useState } from "react";

interface menuProps {
  handleMenu: Function;
  children: React.ReactNode;
}

const Menu: React.FC<menuProps> = (props) => {
  /**
   * 状態定義
   */
  //Router
  const navigate = useNavigate();
  //左側メニュー
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  //右側メニュー
  const [isRightOpen, setIsRightOpen] = useState(false);

  /**
   * 関数定義
   */
  function menuChange(value: string): void {
    props.handleMenu(value);
    setIsLeftOpen(false);
  }

  return (
    <div className={style.appContainer}>
      {
        //左側エリア
        <div className={`${style.leftArea} ${isLeftOpen && style.show}`}>
          <button className={style.btnCloseLeft}>
            <CancelButton
              onClick={() => {
                setIsLeftOpen(!isLeftOpen);
              }}
            />
          </button>

          <div className={style.appName}>MyDocs</div>

          <Home className={style.sideMenu} onClick={() => menuChange("")} />
          <Picture
            className={style.sideMenu}
            onClick={() => menuChange("mypicture")}
          />
          <Rank className={style.sideMenu} onClick={() => menuChange("rank")} />
          <Schedule
            className={style.sideMenu}
            onClick={() => menuChange("schedule")}
          />
          <Present
            className={style.sideMenu}
            onClick={() => menuChange("present")}
          />

          <button className={style.btnLogout}>
            <Logout
              className={style.sideMenu}
              onClick={() => menuChange("user")}
            />
          </button>
        </div>
      }

      {
        //内容
        <div className={style.mainArea}>
          <OpenLeft
            className={style.btnShowLeftArea}
            onClick={() => {
              setIsLeftOpen(!isLeftOpen);
            }}
          />

          <OpenRight
            className={style.btnShowRightArea}
            onClick={() => {
              setIsRightOpen(!isRightOpen);
            }}
          />
          {props.children}
        </div>
      }

      {
        //右側エリア
        <div className={`${style.rightArea} ${isRightOpen && style.show}`}>
          <CancelButton
            className={style.btnCloseRight}
            onClick={() => {
              setIsRightOpen(!isRightOpen);
            }}
          />

          <div className={style.rightAreaHeaderWrapper}>
            <p className={style.rightAreaHeader}>通知</p>
            <button className={style.moreAction}></button>
          </div>

          <div className={style.downloadItemLine}>
            <div className={style.lineHeader}>Today</div>
            <div className={style.downloadArea}>
              <div className={style.downloadItemIcon}>
                <File />
              </div>
              <div className={style.downloadItemTexts}>
                <p className={style.downloadTextHeader}>測試.mp4</p>
                <p className={style.downloadTextInfo}>
                  34.45 MB<span>等待下載...</span>
                </p>
              </div>
              <div className={style.downloadIcon}>
                <Download />
              </div>
            </div>
          </div>
          {
            //yesterday
          }
          <div className={style.downloadItemLine}>
            <div className={style.lineHeader}>Yesterday</div>
            <div className={style.downloadArea}>
              <div className={style.downloadItemIcon}>
                <Downloading />
              </div>
              <div className={style.downloadItemTexts}>
                <p className={style.downloadTextHeader}>測試.mp4</p>
                <div className={style.progressBar}>
                  <span className={style.progress}></span>
                </div>
              </div>
              <div className={style.downloadIcon}>
                <Stop />
              </div>
            </div>
          </div>

          <div className={style.rightAreaHeaderWrapper}>
            <p className={style.rightAreaHeader}>File Received</p>
          </div>

          <div className={style.receivedItemLine}>
            <div className={style.progressLine}>
              <span className={`${style.time} ${style.start}`}>15:30</span>
              <span className={`${style.time} ${style.end}`}>18:30</span>
            </div>
            <div className={style.receivedItemsContent}>
              <div className={style.receivedFiles}>
                <div className={style.imageWrapper}>
                  <img src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80" />
                </div>
                <div className={style.imageWrapper}>
                  <img src="https://images.unsplash.com/photo-1498855926480-d98e83099315?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80" />
                </div>
                <div className={style.imageWrapper}>
                  <img src="https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80" />
                </div>
              </div>
              <div className={style.receivedFilesInfo}>
                Received <span className={style.infoPurple}>3 images</span>{" "}
                total <span className={style.infoPurple}>50.3 MB</span>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default Menu;
