import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kdqjnyhhxbafdhgwpzhq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkcWpueWhoeGJhZmRoZ3dwemhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4OTQ0NTcsImV4cCI6MjA3MjQ3MDQ1N30.Ty_rSK371f3e8h1X4KMX6Bn9nUKWIxSdqSFRzw3dMOY";

export const supabase = createClient(supabaseUrl, supabaseKey);
