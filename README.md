# Shri Vriddi Films — Standard Colorful React + Supabase Website

A mobile-first photography/film studio website with a polished, colorful editorial design.

## Design
- Warm cream base
- Coral, yellow, lavender, sage and blue accents
- Playfair Display + DM Sans typography
- Responsive navigation
- Framer Motion page and scroll animations
- Portfolio categories
- Event galleries
- Photo + video support
- WhatsApp, Instagram, phone and email CTAs
- Supabase-ready content

## Contact details already configured
- Instagram: @shri_vriddhi_films_images
- Phone: +91 97316 04959
- WhatsApp: +91 97316 04959
- Email: akasharalikatti8055@gmail.com

## Run
1. Extract the ZIP.
2. Open the folder in VS Code.
3. Run `npm install`.
4. Copy `.env.example` to `.env`.
5. Add your Supabase URL and anon key.
6. Run `npm run dev`.

## Supabase
Run `supabase/schema.sql` in Supabase SQL Editor.

Create a Storage bucket called `studio-media`. Configure Storage policies appropriate for your project.

For production, replace the starter authenticated write policies with an admin-only policy tied to the studio admin account.

## Important
Never put the Supabase service-role/secret key in frontend code. Only use the public anon/publishable key in Vite environment variables.
