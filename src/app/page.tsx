"use client"
import Image from "next/image";
import { redirect } from "next/navigation";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      {/* Main Content (Middle Area with Background Image) */}
      <div className="absolute top-0 left-0 w-full h-full">
        <Image
          src="/car.jpeg"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
      </div>

      {/* Top Section */}
      <div className="absolute top-0 left-0 w-full px-8 py-4 flex justify-between items-center z-10">
        {/* Left Side - Navigation Links */}
        <div className="flex gap-8 text-white">
          <a href="#our-team" className="hover:underline">Our Team</a>
          <a href="#packages" className="hover:underline">Packages</a>
          <a href="#news" className="hover:underline">News</a>
        </div>

        {/* Right Side - Sign In Button */}
        <div className="flex">
          <a
            href="#sign-in"
            className="bg-transparent border-2 border-white text-white py-2 px-6 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition duration-300"
            onClick={() => redirect('/login')}
          >
            Sign In
          </a>
        </div>
      </div>

      {/* Main Content (Middle Area with Text) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-10">
        <h1 className="text-4xl sm:text-6xl font-bold">Welcome to Our School</h1>
        <p className="mt-4 text-lg">We offer great education with a focus on your future</p>
      </div>

      {/* Footer Section - Contact Info */}
      <footer className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white py-6">
  <div className="flex flex-col sm:flex-row justify-start gap-8 text-left pl-8 sm:pl-16"> {/* Use justify-start and add padding for spacing */}
    {/* Contact Info */}
    <div className="mb-6 sm:mb-0">
      <h3 className="font-semibold">Contact Us</h3>
      <p className="text-sm">Address: 123 School St, City, Country</p>
      <p className="text-sm">Phone: +1 (123) 456-7890</p>
      <p className="text-sm">Email: contact@school.com</p>
    </div>
  </div>

  {/* Google Maps Embed */}
  <div className="flex justify-start items-center sm:w-1/3 pl-8 sm:pl-16"> {/* Align the map iframe to the left */}
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.964551804118!2d144.95373631531665!3d-37.81621777975113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d49b144618f%3A0x5045675218ce6e0!2sFederation+Square!5e0!3m2!1sen!2sus!4v1511815300423"
      width="300"
      height="300"
      style={{ border: 0 }}
      allowFullScreen={true}
      loading="lazy"
      className="rounded-lg"
    />
  </div>
</footer>

    </div>
  );
}
