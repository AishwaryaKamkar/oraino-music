
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Auto-create profile + role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Songs table (cached from external APIs)
CREATE TABLE public.songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL DEFAULT 'Unknown',
  album TEXT DEFAULT '',
  duration INTEGER DEFAULT 0,
  source TEXT NOT NULL CHECK (source IN ('youtube', 'jamendo')),
  source_id TEXT NOT NULL,
  thumbnail TEXT DEFAULT '',
  preview_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (source, source_id)
);
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read songs" ON public.songs
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone authenticated can insert songs" ON public.songs
  FOR INSERT TO authenticated WITH CHECK (true);

-- Playlists table
CREATE TABLE public.playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own playlists" ON public.playlists
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own playlists" ON public.playlists
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own playlists" ON public.playlists
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own playlists" ON public.playlists
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Playlist songs junction table
CREATE TABLE public.playlist_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES public.playlists(id) ON DELETE CASCADE NOT NULL,
  song_id UUID REFERENCES public.songs(id) ON DELETE CASCADE NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (playlist_id, song_id)
);
ALTER TABLE public.playlist_songs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own playlist songs" ON public.playlist_songs
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.playlists WHERE id = playlist_id AND user_id = auth.uid()));
CREATE POLICY "Users can add to own playlists" ON public.playlist_songs
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.playlists WHERE id = playlist_id AND user_id = auth.uid()));
CREATE POLICY "Users can remove from own playlists" ON public.playlist_songs
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.playlists WHERE id = playlist_id AND user_id = auth.uid()));

-- Favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  song_id UUID REFERENCES public.songs(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, song_id)
);
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own favorites" ON public.favorites
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites" ON public.favorites
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove favorites" ON public.favorites
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Recently played table
CREATE TABLE public.recently_played (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  song_id UUID REFERENCES public.songs(id) ON DELETE CASCADE NOT NULL,
  played_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.recently_played ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own history" ON public.recently_played
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can add history" ON public.recently_played
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own history" ON public.recently_played
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
