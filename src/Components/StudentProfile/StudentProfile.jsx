import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance/axiosInstance";
import bgsnow from '../../assets/bg-snow.jpg';
import './students.css'

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/api/students/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProfile(res.data.student);
      console.log("Fetched student data", res.data.student);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

const downloadFile = async (url, filename) => {
  try {
    const response = await fetch(url, { mode: "cors" });
    const blob = await response.blob();

    // ✅ Extract file extension from the URL
    const urlParts = url.split(".");
    const extension = urlParts[urlParts.length - 1].split("?")[0]; // handles signed URLs

    // ✅ Append extension to filename if not already included
    const finalFilename = filename.includes(".") ? filename : `${filename}.${extension}`;

    // ✅ Create download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = finalFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Download failed:", error);
  }
};


  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  if (!profile)
    return <p className="text-center text-red-500 mt-10">No profile found.</p>;

  return (
    <div className=" bg-cover bg-center bg-fixed brightness-75 w-full " style={{ backgroundImage: `url(${bgsnow})`, minWidth: "100vw"  }}>
      <div className="py-10 "> 
         <div className="rounded-xl shadow-lg p-10 bg-white/30 backdrop-blur-md border border-white/40 mx-10">
       
        <h2 className="text-3xl font-bold text-white mb-6">
          Student Profile
        </h2>

        {/* ✅ Personal Information */}
        <h3 className="text-xl font-semibold text-white mb-3">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileField label="Given Name" value={profile.givenName} />
          <ProfileField label="Surname" value={profile.surname} />
          <ProfileField label="Date of Birth" value={profile.dob} />
          <ProfileField label="Gender" value={profile.gender} />
          <ProfileField label="Home District" value={profile.homeDistrict} />
          <ProfileField label="Home Province" value={profile.homeProvince} />
          <ProfileField label="Email ID" value={profile.email} />
          <ProfileField label="WhatsApp" value={profile.whatsapp} />
          <ProfileField label="Parent Email" value={profile.parentsEmail} />
          <ProfileField
            label="Parent WhatsApp"
            value={profile.parentsWhatsapp}
          />
        </div>

        {/* ✅ Academic Details */}
        <h3 className="text-xl font-semibold text-purple-100 mt-8 mb-3">
          Academic Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          <ProfileField label="Country of Study" value={profile.countryOfStudy} />
          <ProfileField label="Year of Admission" value={profile.yearOfAdmission} />
          <ProfileField label="University Name" value={profile.universityName} />
          <ProfileField label="Course Name" value={profile.courseName} />
          <ProfileField label="Current Year" value={profile.currentYear} />
        </div>

        {/* ✅ Banking Information */}
        <h3 className="text-xl font-semibold text-purple-100 mt-8 mb-3">
          Banking Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileField label="Account Name" value={profile.accountName} />
          <ProfileField label="Account Number" value={profile.accountNumber} />
          <ProfileField label="Bank Name" value={profile.bankName} />
          <ProfileField label="Branch Name" value={profile.branchName} />
          <ProfileField label="Passport Expiry" value={profile.passportExpiry} />
        </div>

        {/* ✅ Uploaded Files */}
        <h3 className="text-xl font-semibold text-purple-100 mt-8 mb-3 ">
          Uploaded Documents
        </h3>
        <ul className="space-y-2 text-gray-100 list-disc pl-5">
          
          {profile.passportBio && (
            <FileItem
              label="Passport Bio"
              url={profile.passportBio}
              filename="passport_bio"
              downloadFile={downloadFile}
            />
          )}

          {profile.offerLetter && (
            <FileItem
              label="Offer Letter"
              url={profile.offerLetter}
              filename="offer_letter"
              downloadFile={downloadFile}
            />
          )}

          {profile.acceptanceLetter && (
            <FileItem
              label="Acceptance Letter"
              url={profile.acceptanceLetter}
              filename="acceptance_letter"
              downloadFile={downloadFile}
            />
          )}

          {profile.contractState && (
            <FileItem
              label="Contract State"
              url={profile.contractState}
              filename="contract_state"
              downloadFile={downloadFile}
            />
          )}

          {profile.parentsConsent && (
            <FileItem
              label="Parents Consent"
              url={profile.parentsConsent}
              filename="parents_consent"
              downloadFile={downloadFile}
            />
          )}

          {/* ✅ Multiple Files */}
          {Array.isArray(profile.stemCerts) &&
            profile.stemCerts.map((file, i) => (
              <FileItem
                key={i}
                label={`STEM Certificate ${i + 1}`}
                url={file}
                filename={`stem_cert_${i + 1}`}
                downloadFile={downloadFile}
              />
            ))}

          {Array.isArray(profile.semesterReports) &&
            profile.semesterReports.map((file, i) => (
              <FileItem
                key={i}
                label={`Semester Report ${i + 1}`}
                url={file}
                filename={`semester_report_${i + 1}`}
                downloadFile={downloadFile}
              />
            ))}

          {Array.isArray(profile.invoices) &&
            profile.invoices.map((file, i) => (
              <FileItem
                key={i}
                label={`Invoice ${i + 1}`}
                url={file}
                filename={`invoice_${i + 1}`}
                downloadFile={downloadFile}
              />
            ))}

          {Array.isArray(profile.paymentDetails) &&
            profile.paymentDetails.map((file, i) => (
              <FileItem
                key={i}
                label={`Payment Proof ${i + 1}`}
                url={file}
                filename={`payment_proof_${i + 1}`}
                downloadFile={downloadFile}
              />
            ))}
        </ul>
      </div>
    </div>
      </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      {label}
    </label>
    <div className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-800">
      {value || "N/A"}
    </div>
    
  </div>
);

const FileItem = ({ label, url, filename, downloadFile }) => (
  <li>
    {label}:{" "}
    <button
      onClick={() => downloadFile(url, filename)}
      className=" text-gray-100 hover:text-xl px-3 py-1 my-3 box-border rounded bg-blue-900 hover:bg-blue-400"
    >
      Download
    </button>
  </li>
);

export default StudentProfile;
