// What the app needs from a backend. The demo build implements it in the browser (demo.ts); a real server
// only has to provide the same calls.

export interface Guest { id: string; name: string; joinedAt: number }

export interface Photo {
  id: string;
  guestId: string;
  guestName: string;
  title: string;
  src: string; // URL or data URL
  width: number;
  height: number;
  createdAt: number;
  likes: number;
  likedByMe: boolean;
  hidden: boolean;
}

export interface Wish {
  id: string;
  guestId: string;
  guestName: string;
  text: string;
  createdAt: number;
  updatedAt: number;
  hidden: boolean;
  featured: boolean;
}

export interface Draw { id: string; prize: string; guestId: string; guestName: string; at: number }

export interface Photographer { guestId: string; guestName: string; photos: number; likes: number }

export interface Stats { guests: number; photos: number; wishes: number; likes: number }

export type PhotoSort = "new" | "top";
export interface PhotoQuery { sort: PhotoSort; q?: string; offset?: number; limit?: number; includeHidden?: boolean }
export interface Page<T> { items: T[]; total: number }

export interface NewPhoto { title: string; src: string; width: number; height: number }

export interface WeddingApi {
  join(name: string): Promise<Guest>;
  stats(): Promise<Stats>;

  photos(viewer: string | null, query: PhotoQuery): Promise<Page<Photo>>;
  myPhotos(guestId: string): Promise<Photo[]>;
  upload(guestId: string, photos: NewPhoto[]): Promise<Photo[]>;
  deletePhoto(guestId: string, photoId: string): Promise<void>;
  toggleLike(guestId: string, photoId: string): Promise<{ liked: boolean; likes: number }>;

  wishes(includeHidden?: boolean): Promise<Wish[]>;
  myWish(guestId: string): Promise<Wish | null>;
  saveWish(guestId: string, text: string): Promise<Wish>;

  photographers(): Promise<Photographer[]>;

  // host tools
  setPhotoHidden(photoId: string, hidden: boolean): Promise<void>;
  setWishHidden(wishId: string, hidden: boolean): Promise<void>;
  setWishFeatured(wishId: string, featured: boolean): Promise<void>;
  draw(prize: string): Promise<Draw | null>;
  draws(): Promise<Draw[]>;
  reset(): Promise<void>;
}

export class ApiError extends Error {}
