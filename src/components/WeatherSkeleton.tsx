import Container from "./Container";

export 
function WeatherSkeleton() {
	return (
		<>
			<section className="space-y-4 animate-pulse">
				<div className="space-y-4">
					<div className="flex gap-1">
						<div className="h-8 w-24 bg-gray-300 rounded"></div>
						<div className="h-4 w-20 bg-gray-300 rounded"></div>
					</div>

					<Container className="gap-10 px-6 items-center">
						<div className="flex flex-col px-4 gap-2">
							<div className="h-20 w-32 bg-gray-300 rounded"></div>
							<div className="h-4 w-20 bg-gray-300 rounded mt-4"></div>
							<div className="h-4 w-24 bg-gray-300 rounded mt-4"></div>
						</div>

						<div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
						
						{Array.from({ length: 8 }).map((_, i) => (
							<div
								key={i}
								className="flex flex-col justify-between gap-4 pb-4 items-center text-xs font-semibold"
							>
								<div className="h-6 w-16 bg-gray-300 rounded"></div>
								<div className="h-8 w-8 bg-gray-300 rounded-full"></div>
								<div className="h-6 w-12 bg-gray-300 rounded"></div>
							</div>
						))}
						</div>
					</Container>
				</div>

				<div className="flex gap-4">
					<Container className="w-fit justify-center flex-col p-4 gap-4 items-center">
						<div className="h-8 w-32 bg-gray-300 rounded"></div>
						<div className="h-12 w-12 bg-gray-300 rounded-full mt-2"></div>
					</Container>

					<Container className="bg-gray-300 p-4 gap-6 justify-between overflow-x-auto">
						{Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className="h-10 w-20 bg-gray-300 rounded"></div>
						))}
					</Container>
				</div>
			</section>

			<section className="flex w-full flex-col gap-5 animate-pulse">
				<div className="h-8 w-40 my-4 bg-gray-300 rounded"></div>
				{Array.from({ length: 7 }).map((_, i) => (
					<div
						key={i}
						className="flex gap-4 items-center bg-gray-300 p-4 rounded-md"
					>
						<div className="h-12 w-12 bg-gray-300 rounded-full"></div>
							<div className="flex flex-col w-full">
							<div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
							<div className="h-4 w-20 bg-gray-300 rounded"></div>
						</div>
					</div>
				))}
			</section>
		</>
	)
}
