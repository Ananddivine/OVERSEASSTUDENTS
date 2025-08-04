import React, { useState, useEffect  } from "react";
import axiosInstance from "../axiosInstance/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bgsnow from '../../assets/bg-snow.jpg';


const StudentUploadForm = () => {
   const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    givenName: "",
    surname: "",
    dob: "",
    gender: "",
    homeDistrict: "",
    homeProvince: "",
    email: "",
    whatsapp: "",
    parentsEmail: "",
    parentsWhatsapp: "",
    countryOfStudy: "",
    yearOfAdmission: "",
    universityName: "",
    courseName: "",
    currentYear: "",
    accountName: "",
    accountNumber: "",
    bankName: "",
    branchName: "",
    passportExpiry: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [files, setFiles] = useState({
     profileImage: null,  
    passportBio: null,
    stemCerts: [],
    offerLetter: null,
    acceptanceLetter: null,
    semesterReports: [],
    invoices: [],
    invoiceDescriptions: [],
    contractState: null,
    parentsConsent: null,
    paymentDetails: [],
  });

  const token = localStorage.getItem("token");
  const [options, setOptions] = useState({
  country: [],
  university: [],
  year: [],
});


  // ✅ Handle Input Changes
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

// ✅ Corrected Profile Image Change Handler
const handleProfileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setProfileImage(URL.createObjectURL(file));
    setFiles({ ...files, profileImage: file }); // ✅ changed to profileImage
  }
};


  // ✅ Handle File Changes
  const handleFileChange = (e, type, multiple = false) => {
    if (multiple) {
      setFiles({ ...files, [type]: Array.from(e.target.files) });
    } else {
      setFiles({ ...files, [type]: e.target.files[0] });
    }
  };

   const uploadSingleFile = async (file, type) => {
    console.log("Uploading:", file);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const res = await axiosInstance.post("/api/students/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.fileUrl;
  };

  // ✅ Upload Multiple Files
  const uploadMultipleFiles = async (fileList, type) => {
    const urls = [];
    for (let file of fileList) {
      const url = await uploadSingleFile(file, type);
      urls.push(url);
    }
    return urls;
  };

  // ✅ Submit Form
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const uploadedData = {};

   for (let key in files) {
  if (!files[key]) continue;

  // ✅ Skip invoiceDescriptions explicitly (not a file)
  if (key === "invoiceDescriptions") continue;

  if (key === "invoices") {
    const invoiceUrls = await uploadMultipleFiles(files.invoices, "invoices");
    const invoiceData = invoiceUrls.map((url, idx) => ({
      url,
      description: files.invoiceDescriptions?.[idx] || "",
    }));
    uploadedData.invoices = invoiceData;
  } else if (Array.isArray(files[key]) && files[key][0] instanceof File) {
    uploadedData[key] = await uploadMultipleFiles(files[key], key);
  } else if (files[key] instanceof File) {
    uploadedData[key] = await uploadSingleFile(files[key], key);
  }
}

    const payload = { ...form, ...uploadedData };

    await axiosInstance.put("/api/students/update-profile", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Profile and files uploaded successfully!");
  } catch (err) {
    toast.error("Upload failed");
    console.error("Update Profile Error:", err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const fetchOptions = async () => {
    try {
      const res = await axiosInstance.get("/api/options");
      setOptions(res.data);
    } catch (error) {
      console.error("Failed to fetch options:", error);
    }
  };

  fetchOptions();
}, []);

  return (

      <>
          <div className=" bg-cover bg-center bg-fixed brightness-75 w-full" style={{ backgroundImage: `url(${bgsnow})`, minWidth: "100vw"  }}>
  <div className="py-10"> 
     <div className="rounded-xl shadow-lg p-10 bg-white/30 backdrop-blur-md border border-white/40 mx-10">
        <h2 className="text-3xl font-bold text-white mb-8">
          Student Personal Information
        </h2>

       <form onSubmit={handleSubmit} className="mt-2 font-poppins text-cyan-50">
        {/* ✅ PERSONAL DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Given Name", name: "givenName" },
            { label: "Surname", name: "surname" },
            { label: "Date of Birth", name: "dob", type: "date" },
          ].map((item, i) => (
            <div key={i}>
              <label className="block font-semibold">{item.label}</label>
              <input
                type={item.type || "text"}
                name={item.name}
                onChange={handleInputChange}
                className="w-full border rounded p-2 outline-blue-500 text-gray-800"
              />
            </div>
          ))}

          <div>
            <label className="block font-semibold">Gender</label>
            <select
              name="gender"
              onChange={handleInputChange}
              className="w-full border rounded p-2 text-gray-800"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {[
            { label: "Home District", name: "homeDistrict" },
            { label: "Home Province", name: "homeProvince" },
            { label: "Email", name: "email", type: "email" },
            { label: "WhatsApp Number", name: "whatsapp" },
            { label: "Parent's Email", name: "parentsEmail", type: "email" },
            { label: "Parent's WhatsApp No", name: "parentsWhatsapp" },
            { label: "courseName", name: "courseName" },
          ].map((item, i) => (
            <div key={i}>
              <label className="block font-semibold">{item.label}</label>
              <input
                type={item.type || "text"}
                name={item.name}
                onChange={handleInputChange}
                className="w-full border rounded p-2 text-gray-800"
              />
            </div>
          ))}
        </div>

        {/* ✅ STUDY DETAILS */}
        <h3 className="text-xl font-bold mt-6">Study Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Country of Study</label>
            <select
              name="countryOfStudy"
              onChange={handleInputChange}
              className="w-full border rounded p-2 text-gray-800"
            >
              <option value="">Select</option>
              {options.country.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

          </div>
          <div>
            <label className="block font-semibold">Year of Admission</label>
            <select
              name="yearOfAdmission"
              onChange={handleInputChange}
              className="w-full border rounded p-2 text-gray-800"
            >
               <option value="">Select</option>
               {options.year.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
              <label className="block font-semibold">University Name</label>
              <select
                name="universityName"
                onChange={handleInputChange}
                className="w-full border rounded p-2 text-gray-800"
              >
                <option value="">Select</option>
                {options.university.map((uni) => (
                  <option key={uni}>{uni}</option>
                ))}
              </select>
            </div>

          <div>
            <label className="block font-semibold">Current Year</label>
            
            <select
              name="currentYear"
              onChange={handleInputChange}
              className="w-full border rounded p-2 text-gray-800"
            > <option value="">Select</option>
              {[1, 2, 3, 4, 5].map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ✅ BANK DETAILS */}
        <h3 className="text-xl font-bold mt-6">PNG Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Account Name", name: "accountName" },
            { label: "Account Number", name: "accountNumber" },
            { label: "Bank Name", name: "bankName" },
            { label: "Branch Name", name: "branchName" },
          ].map((item, i) => (
            <div key={i}>
              <label className="block font-semibold">{item.label}</label>
              <input
                type="text"
                name={item.name}
                onChange={handleInputChange}
                className="w-full border rounded p-2 text-gray-800"
              />
            </div>
          ))}
        </div>


        {/* ✅ PROFILE IMAGE */}
        <h3 className="text-xl font-bold mt-6">Profile Image</h3>
        <div className="flex items-center gap-4">
          <div className="w-32 h-32 border-2 border-dashed border-gray-400 rounded overflow-hidden relative cursor-pointer">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <label className="w-full h-full flex items-center justify-center text-gray-500 text-sm cursor-pointer">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            )}
          </div>
        </div>

        {/* ✅ DOCUMENT UPLOADS */}
        <h3 className="text-xl font-bold mt-6">Document Uploads</h3>

         <div className="rounded-xl shadow-lg p-6 bg-white/30 backdrop-blur-md border border-white/40">
              <label className="block font-semibold text-red-700 mb-2">Invoices</label>
              <input
                type="file"
                multiple
                onChange={(e) => {
                  const invoiceFiles = Array.from(e.target.files);
                  const descriptions = invoiceFiles.map(() => "");
                  setFiles({
                    ...files,
                    invoices: invoiceFiles,
                    invoiceDescriptions: descriptions,
                  });
                }}
                className="w-full mb-4"
              />

          {files.invoices?.map((file, index) => (
            <div key={index} className="mb-4">
              <p className="text-white font-semibold mb-1">{file.name}</p>
              <textarea
                placeholder="Enter description for this invoice..."
                className="w-full p-2 rounded border text-gray-800"
                value={files.invoiceDescriptions?.[index] || ""}
                onChange={(e) => {
                  const updated = [...files.invoiceDescriptions];
                  updated[index] = e.target.value;
                  setFiles({ ...files, invoiceDescriptions: updated });
                }}
              />
            </div>
          ))}
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Passport Bio Page</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, "passportBio")}
              className="w-full"
            />
          </div>
          <div>
            <label className="block font-semibold">Passport Date of Expiry</label>
            <input
              type="date"
              name="passportExpiry"
              onChange={handleInputChange}
              className="w-full border rounded p-2 text-gray-800"
            />
          </div>
          <div>
            <label className="block font-semibold">
              STEM & USSC Certificates
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => handleFileChange(e, "stemCerts", true)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block font-semibold">Offer Letter / I-20</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, "offerLetter")}
              className="w-full"
            />
          </div>
          <div>
            <label className="block font-semibold">Acceptance Letter</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, "acceptanceLetter")}
              className="w-full"
            />
          </div>
          <div>
            <label className="block font-semibold">Semester Reports</label>
            <input
              type="file"
              multiple
              onChange={(e) => handleFileChange(e, "semesterReports", true)}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block font-semibold">
              Student Contract with State
            </label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, "contractState")}
              className="w-full"
            />
          </div>
          <div>
            <label className="block font-semibold">Parent's Consent</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, "parentsConsent")}
              className="w-full"
            />
          </div>         

        </div>

        {/* ✅ PAYMENT DETAILS */}
        <h3 className="text-xl font-bold mt-6">Semester Invoices Upload</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          {[''].map((sem) => (
            <div key={sem}>
              <label className="block font-semibold">
                Year - Semester {sem}
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "paymentDetails", true)}
                className="w-full"
                multiple
              />
            </div>
          ))}
        </div>

        {/* ✅ SUBMIT BUTTON */}
        <div className="text-center mt-6 items-center">
          <button
            type="submit"
            className="mt-2 w-fit px-4 py-2 rounded-md text-white bg-purple-700 flex items-center justify-center"
             disabled={loading}
          >
            {loading ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
            ) : null}
            Submit Form
          </button>
        </div>
      </form>
      

      </div>
  </div>

    </div>
        <ToastContainer
  position="top-right"
  autoClose={3000}
  newestOnTop={true}
  closeOnClick
  draggable
  pauseOnHover
  style={{ zIndex: 9999 }} // ✅ Higher than modal z-index
/>
</>
  );
};

export default StudentUploadForm;
