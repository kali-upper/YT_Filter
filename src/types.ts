export interface Video {
  id: string;
  title: string;
  language: 'EN' | 'AR';
  category?: 'entertainment' | 'education' | 'religious' | 'programming';
}

export interface VideoCardProps {
  id: string;
  title: string;
  language?: 'EN' | 'AR';
  category?: 'entertainment' | 'education' | 'religious' | 'programming';
  listId?: string;
  listType?: 'playlist' | 'user_uploads';
}

export interface Playlist {
  id: string;
  title: string;
  language: 'EN' | 'AR';
  category?: 'entertainment' | 'education' | 'religious' | 'programming';
}

export interface PlaylistProps {
  id: string;
  title: string;
  language: 'EN' | 'AR';
  category?: 'entertainment' | 'education' | 'religious' | 'programming';
}