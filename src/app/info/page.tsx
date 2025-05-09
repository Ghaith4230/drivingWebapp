"use client"; // This ensures the component is treated as a client-side component

import { createProfile } from '@/db/queries/insert';
import { redirect } from 'next/navigation';
import React, { useState } from 'react';
import BackgroundLayout from '../components/BackgroundLayout'; // Import the BackgroundLayout component
import Link from 'next/link';

interface FormData {
  userId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  country: string;
  zipCode: string;
  gender: string;
}

const FormPage = () => {
  const [formData, setFormData] = useState<FormData>({
    userId: 0,
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    country: '',
    zipCode: '',
    gender: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be digits only';
    }
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.zipCode) {
      newErrors.zipCode = 'Zip code is required';
    } else if (!/^[0-9]+$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Zip code must be digits only';
    }
    if (!formData.gender) newErrors.gender = 'Gender is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Make the API request
    const response = await fetch("api/userId", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({/* any request body if needed*/}),
    });

    // Parse the JSON response
    const data = await response.json();

    // Check if the response contains the "message" field and if it can be converted to a number
    if (data && data.message) {
      const userId = parseInt(data.message, 10); // Convert message to number
      formData.userId = userId;
    } else {
      console.error("Response does not contain a valid message field.");
    }

    if (validate()) {
      createProfile(formData);
      redirect('/dashboard');
    }
  };

  return (
      <BackgroundLayout>
        <div className="relative min-h-screen flex justify-center items-center">
          {/* Top Section - Navigation Links (Buttons) */}
          <div className="absolute top-0 left-0 w-full px-8 py-4 flex justify-between items-center z-10">
            {/* Left Side - Navigation Links */}
            <div className="flex gap-8 text-white">
              <Link href="/#our-team" className="hover:underline">
                Our Team
              </Link>
              <Link href="/#packages" className="hover:underline">
                Packages
              </Link>
              <Link href="/#news" className="hover:underline">
                News
              </Link>
            </div>
          </div>

          {/* Form Box */}
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md text-black z-10">
            <h2 className="text-2xl font-semibold text-center text-black">Personal Information Form</h2>
            <form className="mt-4" onSubmit={handleSubmit} noValidate>
              {/* First Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-black">First Name</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-black">Last Name</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>

              {/* Phone Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-black">Phone Number</label>
                <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
              </div>

              {/* Address */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-black">Address</label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              {/* Country */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-black">Country</label>
                <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
              </div>

              {/* Zip Code */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-black">Zip Code</label>
                <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
              </div>

              {/* Gender - Dropdown */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-black">Gender</label>
                <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
              </div>

              {/* Button Section - Back and Submit */}
              <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="w-1/4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition flex items-center justify-center gap-2"
                >
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                  >
                    <path
                        fillRule="evenodd"
                        d="M7.707 14.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L4.414 9H16a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                    />
                  </svg>
                  Back
                </button>
                <button
                    type="submit"
                    className="w-3/4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </BackgroundLayout>
  );
};

export default FormPage;
