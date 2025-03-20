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
import { ReactComponent as Box } from "../../assets/svgs/boxMark.svg";
import { ReactComponent as OpenRight } from "../../assets/svgs/rightMark.svg";
import { ReactComponent as OpenLeft } from "../../assets/svgs/leftMark.svg";
import { ReactComponent as Letter } from "../../assets/svgs/letterMark.svg";
import { ReactComponent as Clock } from "../../assets/svgs/clockMark.svg";
import Step from "../Step/Step";
import { useEffect, useState } from "react";
import { getCommentApi, getFileListApi } from "../../request";
import moment from "moment";
import { StepModel } from "../Step/step.interface";
import { getScheduleConstant } from "../../constants/scheduleConstant";

/**
 * メニューコンポーネントのプロパティインターフェース
 */
interface menuProps {
  showHeader?: boolean; // ヘッダー表示フラグ
  handleMenu: Function; // メニュー選択時の処理関数
  handleUser: Function; // ユーザー関連の処理関数
  children: React.ReactNode; // 子コンポーネント
}

/**
 * メニューコンポーネント
 * アプリケーションのメインナビゲーションを提供
 */
const Menu: React.FC<menuProps> = (props) => {
  /**
   * 状態定義
   */
  // 左側メニューの表示状態
  const [isLeftOpen, setIsLeftOpen] = useState<boolean>(false);
  // 右側メニューの表示状態
  const [isRightOpen, setIsRightOpen] = useState<boolean>(false);
  // ユーザー情報
  const userInfo = {
    userName: localStorage.getItem("userName"),
    sqlNo: localStorage.getItem("sqlNo"),
  };
  // コメント内容
  const [comment, setComment] = useState<string>("");

  // 現在時刻
  const timeNow = moment().format("HHss");

  // スケジュールデータ
  const [scheduleData, setScheduleData] = useState<StepModel>();

  // ファイルリストの長さ
  const [fileLen, setFileLen] = useState<number>(0);

  /**
   * 関数定義
   */
  // メニュー選択時の処理
  function menuChange(value: string): void {
    props.handleMenu(value);
    setIsLeftOpen(false);
  }

  // スケジュール処理
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

  // 右側メニュー表示処理
  async function handleRightClick(): Promise<void> {
    setIsRightOpen(!isRightOpen);
    await getComment();
    await getFileList();
    handleSchedule();
  }

  // ファイルリスト取得
  async function getFileList(): Promise<void> {
    if (userInfo.sqlNo == null || userInfo.sqlNo == "") {
      return;
    }
    const result = await getFileListApi({ sqlNo: userInfo.sqlNo });

    if (result.code == 0) {
      setFileLen(result.fileList.length);
    }
  }

  // コメント取得
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
   * 副作用定義
   */
  // 初期表示時にスケジュールを取得
  useEffect(() => {
    handleSchedule();
  }, []);

  return (
    <div className={style.appContainer}>
      {/* 左側メニューエリア */}
      <div className={`${style.leftArea} ${isLeftOpen && style.show}`}>
        <button className={style.btnCloseLeft}>
          <CancelButton
            onClick={() => {
              setIsLeftOpen(!isLeftOpen);
            }}
          />
        </button>

        <div className={style.appName}>Menu</div>

        {/* メニューアイコン */}
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
        {/* <Present
          className={style.sideMenu}
          onClick={() => menuChange("present")}
        /> */}

        {/* ログアウトボタン */}
        <button className={style.btnLogout}>
          <Logout
            className={style.sideMenu}
            onClick={() => props.handleUser(true)}
          />
        </button>
      </div>

      {/* メインコンテンツエリア */}
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

      {/* 右側メニューエリア */}
      <div className={`${style.rightArea} ${isRightOpen && style.show}`}>
        <CancelButton
          className={style.btnCloseRight}
          onClick={() => {
            setIsRightOpen(!isRightOpen);
          }}
        />

        {/* 通知セクション */}
        <div className={style.rightAreaHeaderWrapper}>
          <p className={style.rightAreaHeader}>通知</p>
          <button className={style.moreAction}></button>
        </div>

        {/* 今日のファイル情報 */}
        <div className={style.downloadItemLine}>
          <div className={style.lineHeader}>Today</div>
          <div className={style.downloadArea}>
            <div className={style.downloadItemIcon}>
              <File />
            </div>
            <div className={style.downloadItemTexts}>
              <p className={style.downloadTextHeader}>照片</p>
              <p className={style.downloadTextInfo}>
                已上傳<span>{fileLen} 個檔案</span>
              </p>
            </div>
            <div className={style.downloadIcon}>
              <Box />
            </div>
          </div>
        </div>

        {/* 現在のスケジュール */}
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

        {/* 祝福メッセージ */}
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
    </div>
  );
};

export default Menu;
