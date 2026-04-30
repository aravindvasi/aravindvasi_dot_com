# aravindvasi_dot_com
This repository is for developing and managing the aravindvasi.com website


aravindvasi.com
Personal portfolio for Aravind V. A. — static HTML/CSS/JS, deployed via GitHub Pages.
Local preview

Open this folder in VS Code.
Install the Live Server extension (by Ritwick Dey).
Right-click index.html → Open with Live Server.

Files
index.html   — all content (sections, copy, links)
style.css    — design system (colors, fonts, layout)
script.js    — particles, scroll reveal, nav
CNAME        — tells GitHub Pages your custom domain
README.md    — this file
How to update content
All copy lives in index.html. Sections are clearly labelled with comments:
<!-- ============ HERO ============ -->
<!-- ============ ABOUT ============ -->
<!-- ============ EXPERIENCE ============ -->
<!-- ============ PROJECTS ============ -->
<!-- ============ PUBLICATIONS / CERTIFICATIONS ============ -->
<!-- ============ BLOG ============ -->
<!-- ============ CONTACT ============ -->
Common edits

Tagline: search <!-- TAGLINE: in index.html — change the next line.
Add a project: copy any <article class="project-card reveal"> block in the projects section, paste it in the same grid, edit the inner content.
Add a blog post: replace the .blog-empty block in the Writing section with <article class="blog-card"> entries (a template comment is in the file).
Change the accent color: in style.css, edit --accent: #c4ff3e; near the top.

Deployment to GitHub Pages

Push these files to your repo's main branch.
On GitHub: repo → Settings → Pages.
Under Source, choose Deploy from a branch, branch main, folder / (root). Save.
Wait ~1 minute. Your site will be live at the URL shown there.

Custom domain (aravindvasi.com)
The CNAME file already tells GitHub Pages your domain. You also need DNS at your registrar:
Apex domain (aravindvasi.com) — add four A records pointing to:
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
www subdomain — add a CNAME record:
www → <your-github-org>.github.io
Then in GitHub repo → Settings → Pages:

Custom domain: aravindvasi.com → Save
Tick Enforce HTTPS once the certificate provisions (takes a few minutes to a few hours)

Reference

GitHub Pages custom domain docs: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site