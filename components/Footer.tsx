// components/Footer.tsx

export default function Footer() {
  return (
    <footer className="bg-[#102c29] text-white py-8 mt-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Left Section */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold">DevEvent</h2>
          <p className="text-sm text-gray-300">
            Connecting developers through events, workshops & networking.
          </p>
        </div>

        {/* Middle Links */}
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-gray-300">Home</a>
          <a href="#" className="hover:text-gray-300">Events</a>
          <a href="#" className="hover:text-gray-300">About</a>
          <a href="#" className="hover:text-gray-300">Contact</a>
        </div>

        {/* Right Section */}
        <div className="text-center md:text-right text-sm text-gray-300">
          © {new Date().getFullYear()} DevEvent. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
