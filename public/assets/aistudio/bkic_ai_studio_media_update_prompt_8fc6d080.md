# AI STUDIO — CẬP NHẬT TƯ LIỆU BK-IC VÀ FANPAGE

The BK-IC Digital Hub project already has a functioning website structure. Update the existing website WITHOUT deleting working routes, Firebase integration, QR attendance, member management or evaluation features.

## Verified by project administrator
Fanpage provided by the BK-IC administrator: https://www.facebook.com/dut.bkic

Use this link in the website footer, Contact page and a Facebook icon/link. It replaces all "pending Facebook page" placeholders.

## Photo assets
Read the attached `bkic_media_manifest.json` file. Import the five new assets with IDs `bkic_facebook_user_01` to `bkic_facebook_user_05` into the club gallery collection. Preserve complete URLs including their query-string parameters if accessing them directly. Do not infer photo subjects or event details solely from filenames. Display them as administrator-supplied images requiring content review unless the actual photo content is inspected and approved.

IMPORTANT: Facebook CDN `scontent.*.fbcdn.net` links are signed and may expire. Attempt to retrieve only assets accessible with appropriate permissions and store authorized originals in stable project storage, with a local fallback placeholder for unavailable files. Do not pretend they downloaded successfully if they did not. Do not scrape private content or bypass Facebook restrictions.

## Landing page visual integration
- Create a premium, Apple-like "Khoảnh khắc BK-IC" editorial photo gallery.
- Use beautiful asymmetric grids, tasteful hover states, lightbox and responsive image cropping.
- Select hero images only after inspecting the files and validating rights; never crop faces arbitrarily.
- Keep editorial copy from `bkic_landing_content.md`.
- Add social call-to-action: "Theo dõi BK-IC trên Facebook" linking to https://www.facebook.com/dut.bkic.
- Maintain original image quality and aspect ratios when needed.
- Keep user-provided photos separate from generic university ecosystem photos.
- Do not call any supplied image the official BK-IC logo unless that identification is confirmed by the administrator.

Deliver the updated website and a short report of imported vs inaccessible images and any manual steps needed.
