import style from "./rank.module.scss";
import { ReactComponent as SearchButton } from "../../assets/svgs/searchMark.svg";
import { ReactComponent as Maximize } from "../../assets/svgs/maximizeMark.svg";
import Pagination from "react-bootstrap/Pagination";
import { useEffect, useState } from "react";
import { belikeApi, dislikeApi, getAllFileListApi } from "../../request";
import useLoading from "../../hook/useLoading";
import { FileListData } from "../Information/information.interface";
import { ReactComponent as Heart } from "../../assets/svgs/heartMark.svg";

/**
 * ランキングコンポーネント
 * 画像のランキング表示といいね機能を提供
 */
const Rank = () => {
  /**
   * 状態定義
   */
  // ユーザー情報
  const userInfo = {
    userName: localStorage.getItem("userName"),
    sqlNo: localStorage.getItem("sqlNo"),
  };

  // ローディング状態管理
  const loading = useLoading();

  // 現在のページ番号
  const [currentPage, setCurrentPage] = useState(1);

  // 画像リスト
  const [img, setImg] = useState<FileListData[]>([]);

  // 画像最大化状態
  const [max, setMax] = useState<boolean>(false);

  // 総アイテム数
  const [count, setCount] = useState<number>(0);

  // 総ページ数の計算
  const totalPages = Math.ceil(count / 10);

  /**
   * ページネーション関連の関数
   */
  // ページネーションのレンダリング
  const renderPagination = () => {
    const items = [];

    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => pageClick(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return items;
  };

  /**
   * API関連の関数
   */
  // 全画像の取得
  async function getAllImg(page?: number): Promise<void> {
    if (userInfo.sqlNo == null || userInfo.sqlNo == "") {
      return;
    }

    loading.open();
    const result = await getAllFileListApi({
      page: page,
      sqlNo: userInfo.sqlNo,
    });
    if (result.code == 0) {
      setImg(result.fileList);
      setCount(() => result.count);
    }
    loading.close();
  }

  /**
   * イベントハンドラー
   */
  // ページクリック時の処理
  function pageClick(page: number): void {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }

  // いいねボタンクリック時の処理
  function handleClick(item: FileListData, index: number): void {
    setImg((prevItems) => {
      const newItems = [...prevItems];
      const newItem = { ...newItems[index] };
      newItem.isLike = newItem.isLike === "true" ? "false" : "true";
      newItem.beLike =
        newItem.isLike === "true" ? newItem.beLike + 1 : newItem.beLike - 1;

      newItem.isLike === "true" ? belikeClick(item) : dislikeClick(item);
      newItems[index] = newItem;
      return newItems;
    });
  }

  // いいねAPI呼び出し
  async function belikeClick(item: FileListData): Promise<void> {
    if (userInfo.sqlNo == null || userInfo.sqlNo == "") {
      return;
    }
    const param = { pictureSqlNo: item.sqlNo, sqlNo: item.userSqlNo };
    const result = await belikeApi(param);
    if (result.code == 0) {
    }
  }

  // いいね解除API呼び出し
  async function dislikeClick(item: FileListData): Promise<void> {
    if (userInfo.sqlNo == null || userInfo.sqlNo == "") {
      return;
    }
    const param = { pictureSqlNo: item.sqlNo, sqlNo: item.userSqlNo };
    const result = await dislikeApi(param);
    if (result.code == 0) {
    }
  }

  /**
   * 副作用定義
   */
  // ページ変更時の画像取得
  useEffect(() => {
    getAllImg(currentPage);
  }, [currentPage]);

  return (
    <div className={`${style.main}`}>
      {/* ヘッダーエリア */}
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

      {/* 画像表示エリア */}
      <section className={style.contentSection}>
        {img &&
          img.map((item, index) => (
            <div
              className={style.contentSectionLine}
              key={item.sqlNo}
              onDoubleClick={() => handleClick(item, index)}
            >
              <div className={`${style.sectionPart}  ${style.left}`}>
                <a className={style.imageWrapper}>
                  {/* 画像オーバーレイ */}
                  <div className={style.imageOverlay}>
                    <div className={style.videoInfo}>
                      <div className={style.videoInfoText}>
                        <p className={`${style.videoName} ${style.medium}`}>
                          {item.originalName}
                          <br />
                          {item.userName}
                        </p>
                      </div>
                      {/* いいねボタン */}
                      <div className={style.heartBox}>
                        {item.beLike}
                        <Heart
                          className={`${
                            item.isLike == "true" && style.isLike
                          }`}
                          onClick={() => handleClick(item, index)}
                        />
                      </div>
                      {/* 最大化ボタン */}
                      <Maximize
                        className={style.maximize}
                        onClick={() => {
                          const newImg = img.map((imgItem) =>
                            imgItem.sqlNo === item.sqlNo
                              ? {
                                  ...imgItem,
                                  isMaximized: !imgItem.isMaximized,
                                }
                              : imgItem
                          );
                          setImg(newImg);
                        }}
                      />
                    </div>
                  </div>
                  {/* 画像表示 */}
                  <img
                    src={`data:image/png;base64,${item.imgData}`}
                    alt="無法顯示"
                    className={`${item.isMaximized && style.max}`}
                  />
                </a>
              </div>
            </div>
          ))}
        {/* ページネーション */}
        <footer className={style.footer}>
          <div className={style.page}>
            <Pagination>{renderPagination()}</Pagination>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default Rank;
