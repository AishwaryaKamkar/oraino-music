
-- The songs INSERT policy with true is acceptable here because songs are cached from external API results
-- and any authenticated user should be able to cache a song they found via search.
-- However, let's ensure songs can't be updated/deleted by regular users
CREATE POLICY "Only admins can update songs" ON public.songs
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can delete songs" ON public.songs
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
