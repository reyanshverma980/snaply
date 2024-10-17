import { useCallback, useState } from "react";
import Dropzone, { FileWithPath } from "react-dropzone";

const ProfileImageUploader = ({
	fieldChange,
	mediaUrl,
}: {
	fieldChange: (files: File[]) => void;
	mediaUrl: string;
}) => {
	const [fileUrl, setFileUrl] = useState<string>(mediaUrl);

	const onDrop = useCallback(
		(acceptedFiles: FileWithPath[]) => {
			fieldChange(acceptedFiles);
			setFileUrl(URL.createObjectURL(acceptedFiles[0]));
		},
		[fieldChange]
	);

	return (
		<Dropzone onDrop={onDrop}>
			{({ getRootProps, getInputProps }) => (
				<section className="w-20 h-20 flex-center bg-dark-3 rounded-full overflow-hidden cursor-pointer">
					<div {...getRootProps()}>
						<input {...getInputProps()} />
						<img
							src={fileUrl}
							alt="image"
							className="w-full h-full object-cover bg-center cursor-pointer"
						/>
					</div>
				</section>
			)}
		</Dropzone>
	);
};

export default ProfileImageUploader;
