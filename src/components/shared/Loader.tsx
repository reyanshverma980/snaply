type LoaderProps = {
	className?: string;
};

const Loader = ({ className }: LoaderProps) => {
	return (
		<div className="flex-center w-full">
			<img
				src="/assets/icons/loader.svg"
				alt="loader"
				width={24}
				height={24}
				className={`animate-spin ${className}`}
			/>
		</div>
	);
};

export default Loader;
