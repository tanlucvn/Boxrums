import React, { useContext, useState } from "react";
// import { exportComponentAsPNG } from "react-component-export-image";
import { toast } from 'react-hot-toast'
import "./CoverImage.css";
import { ImgContext } from "@/support/ImgContext";
import unsplash from "@/support/unsplashConfig";
import domtoimage from "dom-to-image";
import { EditorContext } from "@/pages/editor.pages";
import { uploadImage } from "@/common/cloudinary";

const ComponentToImg = (props) => {
	const [loading, setLoading] = useState(false)
	const [uploadedData, setUploadedData] = useState("")
	const { blog, setBlog, setBannerWrapper } = useContext(EditorContext)

	const { unsplashImage } = useContext(ImgContext);
	const componentRef = React.createRef();

	async function saveImage(data) {
		const a = document.createElement("A");
		a.href = data;
		a.download = `[BR] banner.png`;
		document.body.appendChild(a);
		setLoading(false)

		a.click();
		document.body.removeChild(a);
	}

	const downloadImage = async () => {
		// exportComponentAsPNG(componentRef, 'cover')
		setLoading(true)

		const element = componentRef.current;

		// console.log(element)
		// console.log(element.offsetHeight)

		let data = await domtoimage.toPng(componentRef.current, {
			height: element.offsetHeight * 2,
			width: element.offsetWidth * 2,
			style: {
				transform: "scale(" + 2 + ")",
				transformOrigin: "top left",
				width: element.offsetWidth + "px",
				height: element.offsetHeight + "px",
			}
		})

		// console.log(data)
		await saveImage(data);

		if (unsplashImage) {
			unsplash.photos.trackDownload({ downloadLocation: unsplashImage.downloadLink, });
		}
	}


	const applyBanner = (data) => {
		console.log(data)
		if (data) {
			let ladingTast = toast.loading('Uploading and applying...')
			uploadImage(data).then((url) => {
				toast.dismiss(ladingTast)
				toast.success("Uploaded and applied successfully")
				setBlog({ ...blog, banner: url })
				setBannerWrapper(false)
			}).catch(err => {
				toast.dismiss(ladingTast)
				toast.error(err)

			})
		}
	}

	const handleApplyBanner = async () => {
		const element = componentRef.current;

		// console.log(element)
		// console.log(element.offsetHeight)

		let data = await domtoimage.toPng(componentRef.current, {
			height: element.offsetHeight * 2,
			width: element.offsetWidth * 2,
			style: {
				transform: "scale(" + 2 + ")",
				transformOrigin: "top left",
				width: element.offsetWidth + "px",
				height: element.offsetHeight + "px",
			}
		})

		// console.log(data)
		await applyBanner(data);

		if (unsplashImage) {
			unsplash.photos.trackDownload({ downloadLocation: unsplashImage.downloadLink, });
		}
	}

	return (
		<React.Fragment>
			<div ref={componentRef}>{props.children}</div>
			<div className="flex gap-3 justify-center">
				<button
					className="btn-light flex mt-5"
					onClick={() => downloadImage()}>
					<span>
						{
							loading ?
								<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white animate animate-spin" fill="currentColor" width="24" height="24" viewBox="0 0 24 24" ><path d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z"></path></svg>
								:
								<i class="fi fi-rr-download"></i>
						}
					</span>

					<span className="mx-2">Download</span>
				</button>

				<button
					className="btn-dark flex mt-5"
					onClick={handleApplyBanner}>
					<span className="mx-2">Apply</span>
				</button>
			</div>
		</React.Fragment>
	);

}

export default ComponentToImg;
