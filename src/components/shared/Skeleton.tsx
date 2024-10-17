import { Skeleton } from "@/components/ui/skeleton";

const SkeletonPage = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen w-full bg-dark-1">
			<div className="w-full max-w-5xl p-4">
				<Skeleton className="h-10 w-48 mb-4 bg-dark-4" />
				<Skeleton className="h-6 w-full mb-2 bg-dark-4" />
				<Skeleton className="h-6 w-full mb-2 bg-dark-4" />
				<Skeleton className="h-6 w-full mb-2 bg-dark-4" />

				<div className="mt-8">
					<Skeleton className="h-8 w-full mb-4 bg-dark-4" />
					<Skeleton className="h-48 w-full mb-4 bg-dark-4" />
					<Skeleton className="h-8 w-full mb-4 bg-dark-4" />
					<Skeleton className="h-10 w-60 mx-auto bg-dark-4" />
				</div>
			</div>
		</div>
	);
};

export default SkeletonPage;
