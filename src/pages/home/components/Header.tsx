function Header() {
	return (
		<div className="w-full bg-[#FFF0DC] lg:px-10 md:py-4 md:px-5 px-2 py-2 flex justify-between items-center">
			<div className="flex items-center">
				<img src="/logo.webp" alt="logo" className="w-16 h-16" />
			</div>
			<nav className="lg:w-1/4">
				<ul className="flex justify-between items-center">
					<li className="text-xl font-medium text-[#131010] hover:text-[#ffa726] duration-300">
						<a href="#">hi</a>
					</li>
					<li className="text-xl font-medium text-[#131010] hover:text-[#ffa726] duration-300">
						<a href="#">hi</a>
					</li>
					<li className="text-xl font-medium text-[#131010] hover:text-[#ffa726] duration-300">
						<a href="#">hi</a>
					</li>
					<li className="text-xl font-medium text-[#131010] hover:text-[#ffa726] duration-300">
						<a href="#">hi</a>
					</li>
				</ul>
			</nav>
			<div className="flex items-center">
				<button className="bg-[#F0BB78] hover:bg-[#ffa726] text-white px-4 py-2 rounded-md">
					Login
				</button>
				<button className="bg-[#F0BB78] hover:bg-[#ffa726] text-white px-4 py-2 rounded-md ml-2">
					Sign Up
				</button>
			</div>
		</div>
	);
}

export default Header;
