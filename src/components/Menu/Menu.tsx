import style from "./Menu.module.scss";
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
import { ReactComponent as Letter } from "../../assets/svgs/letterMark.svg";
import { ReactComponent as Clock } from "../../assets/svgs/clockMark.svg";
import Step from "../Step/Step";
import { useEffect, useState } from "react";
import { getCommentApi } from "../../request";
import moment from "moment";
import { StepModel } from "../Step/step.interface";
import { getScheduleConstant } from "../../constants/scheduleConstant";

interface menuProps {
  showHeader?: boolean;
  handleMenu: Function;
  handleUser: Function;
  children: React.ReactNode;
}

const Menu: React.FC<menuProps> = (props) => {
  /**
   * 状態定義
   */
  //左側メニュー
  const [isLeftOpen, setIsLeftOpen] = useState<boolean>(false);
  //右側メニュー
  const [isRightOpen, setIsRightOpen] = useState<boolean>(false);
  //ユーザーinfo
  const userInfo = {
    userName: localStorage.getItem("userName"),
    sqlNo: localStorage.getItem("sqlNo"),
  };
  //メッセージ
  const [comment, setComment] = useState<string>("");

  //現在時間
  const timeNow = moment().format("HHss");

  //スケジュールデータ
  const [scheduleData, setScheduleData] = useState<StepModel>();

  /**
   * 関数定義
   */
  //メニュー選択処理
  function menuChange(value: string): void {
    props.handleMenu(value);
    setIsLeftOpen(false);
  }

  //スケジュール処理
  function handleSchedule(): void {
    let result = getScheduleConstant();
    const foundItem = result.find(
      (item) =>
        parseInt(item.startTime.replace(":", "")) < parseInt(timeNow) &&
        parseInt(item.endTime.replace(":", "")) > parseInt(timeNow)
    );

    if (foundItem) {
      setScheduleData(foundItem);
    }
  }

  //右側メニュー表示処理
  async function handleRightClick(): Promise<void> {
    setIsRightOpen(!isRightOpen);
    await getComment();
    handleSchedule();
  }

  //comment取得
  async function getComment(): Promise<void> {
    if (userInfo.sqlNo == null || userInfo.sqlNo == "") {
      return;
    }
    const param = { ...userInfo };
    let result = await getCommentApi(param);
    if (result) {
      result = { ...result };
      setComment(result[0].comment);
    }
  }

  /**
   * 監視定義
   */
  useEffect(() => {
    handleSchedule();
  }, []);

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

          <div className={style.appName}>Menu</div>

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
              onClick={() => props.handleUser(true)}
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
          {props.showHeader && (
            <div className={style.mainAreaHeader}>
              <div className={style.textHeader}>Always be in love！</div>
            </div>
          )}
          <OpenRight
            className={style.btnShowRightArea}
            onClick={handleRightClick}
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
            <p className={style.rightAreaHeader}>現在行程</p>
          </div>
          {scheduleData ? (
            <Step StepData={scheduleData} />
          ) : (
            <div className={style.downloadItemLine}>
              <div className={style.downloadArea}>
                <div className={style.downloadItemIcon}>
                  <Clock />
                </div>
                <div className={style.downloadItemTexts}>
                  <p className={style.downloadTextHeader}>
                    別緊張!行程還沒開始呢!
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className={style.downloadItemLine}>
            <div className={style.lineHeader}>您的祝福語</div>
            <div className={style.downloadArea}>
              <div className={style.downloadItemIcon}>
                <Letter />
              </div>
              <div className={style.downloadItemTexts}>
                <p className={style.downloadTextHeader}>
                  {comment ? "內容" : "您還沒寫下任何內容唷"}
                </p>
                <p className={style.letterTextInfo}>
                  <span>{comment}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default Menu;
