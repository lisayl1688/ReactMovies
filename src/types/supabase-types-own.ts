

import { Tables } from "./supabase-types-gen";

export type MovieType = Tables<"Movies">;
export type DirectorType = Tables<"Directors">;



export type CompleteType = MovieType & {
          Directors: DirectorType; 
  };