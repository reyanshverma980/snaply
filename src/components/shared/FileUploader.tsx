import { useCallback, useState } from "react";
import Dropzone, { FileWithPath } from "react-dropzone";
import { Button } from "../ui/button";

type FileUploaderProps = {
	fieldChange: (files: File[]) => void;
	mediaUrl: string;
};

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
	const [fileUrl, setFileUrl] = useState<string>(mediaUrl);

	const onDrop = useCallback(
		(acceptedFiles: FileWithPath[]) => {
			fieldChange(acceptedFiles);
			setFileUrl(URL.createObjectURL(acceptedFiles[0]));
		},
		[fieldChange]
	);

	return (
		<Dropzone
			onDrop={onDrop}
			accept={{ "image/*": [".png", ".jpeg", ".jpg", ".svg"] }}>
			{({ getRootProps, getInputProps }) => (
				<div
					{...getRootProps()}
					className="flex-center flex-col bg-dark-3 rounded-xl cursor-pointer">
					<input {...getInputProps()} className="cursor-pointer" />
					{fileUrl ? (
						<>
							<div className="flex flex-1 justify-center w-full p-5 lg:p-10">
								<img src={fileUrl} alt="image" className="file_uploader-img" />
							</div>
							<p className="file_uploader-label mb-6">
								Click or Drag photo to replace
							</p>
						</>
					) : (
						<div className="file_uploader-box">
							<img
								src="/assets/icons/file-upload.svg"
								alt="file-upload"
								width={96}
							/>

							<h3 className="base-medium text-light-2 mb-2 mt-6">
								Drag Photo here
							</h3>
							<p className="file_uploader-label mb-6">SVG, PNG, JPG</p>

							<Button className="shad-button_dark_4">
								Select from computer
							</Button>
						</div>
					)}
				</div>
			)}
		</Dropzone>
	);
};

export default FileUploader;
