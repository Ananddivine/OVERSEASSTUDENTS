import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance/axiosInstance";

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
      console.log("fetched student data", res.data.student)
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-300 mt-20 text-lg font-medium">
        Loading...
      </p>
    );

  if (!profile)
    return (
      <p className="text-center text-red-400 mt-20 text-lg font-medium">
        No profile data found.
      </p>
    );

const downloadFile = async (url, filename) => {
  try {
    const response = await fetch(url, { mode: "cors" });
    const blob = await response.blob();

    // ✅ Detect the correct file extension based on MIME type
    const mimeType = blob.type; // e.g., "image/jpeg", "application/pdf"
    let extension = "";

    switch (mimeType) {
      case "image/jpeg":
        extension = ".jpg";
        break;
      case "image/png":
        extension = ".png";
        break;
      case "image/webp":
        extension = ".webp";
        break;
      case "application/pdf":
        extension = ".pdf";
        break;
      default:
        // fallback: try to get from URL
        extension = url.split(".").pop().split("?")[0];
        extension = extension ? `.${extension}` : "";
    }

    const finalFileName = filename.includes(".")
      ? filename // if already passed with extension
      : `${filename}${extension}`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = finalFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Download failed:", error);
  }
};



  return (
   <div
    className="min-h-screen w-full bg-gradient-to-r from-purple-800 via-purple-800 to-purple-900 font-poppins flex items-center justify-end px-8 py-10"
    style={{ minWidth: "100vw" }} // just to be safe for full viewport width
  >
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-xl rounded-lg overflow-hidden">
      
        
       

        {/* Right side - profile form */}
      <div className="w-full  p-8">
          <h2 className="text-3xl font-bold text-purple-800 mb-6">Welcome</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField label="Name" value={profile.studentName} />
            <ProfileField label="Email" value={profile.email} />
            <ProfileField label="Age" value={profile.age} />
            <ProfileField label="Gender" value={profile.gender} />
            <ProfileField label="Contact Numbers" value={profile.contactNumbers?.join(", ")} />
            <ProfileField label="Current Email" value={profile.currentEmail} />
            <ProfileField label="Account Number" value={profile.accountNumber} />
            <ProfileField label="Branch Name" value={profile.branchName} />
            <ProfileField label="University" value={profile.universityName} />
            <ProfileField label="Country" value={profile.countryName} />
          </div>

          {/* Files Section */}
         {/* Files Section */}
<div className="mt-10">
  <h3 className="text-xl font-semibold text-purple-700 mb-4">
    Uploaded Documents
  </h3>
  <ul className="space-y-2 text-gray-700 list-disc pl-5">
    {profile.passport && (
      <li>
        Passport:{" "}
        <button
          onClick={() => downloadFile(profile.passport, "passport.pdf")}
          className="text-blue-600 underline hover:text-blue-800"
        >
          Download
        </button>
      </li>
    )}

    {profile.passportPhoto && (
      <li>
        Passport Photo:{" "}
        <button
          onClick={() => downloadFile(profile.passportPhoto, "passport_photo.pdf")}
          className="text-blue-600 underline hover:text-blue-800"
        >
          Download
        </button>
      </li>
    )}

    {profile.stemCertificate && (
      <li>
        STEM Certificate:{" "}
        <button
          onClick={() =>
            downloadFile(profile.stemCertificate, "stem_certificate.pdf")
          }
          className="text-blue-600 underline hover:text-blue-800"
        >
          Download
        </button>
      </li>
    )}

    {profile.usscCertificate && (
      <li>
        USSC Certificate:{" "}
        <button
          onClick={() =>
            downloadFile(profile.usscCertificate, "ussc_certificate.pdf")
          }
          className="text-blue-600 underline hover:text-blue-800"
        >
          Download
        </button>
      </li>
    )}

    {profile.offerLetters?.length > 0 && (
      <li>
        Offer Letters:
        <ul className="ml-4 list-disc">
          {profile.offerLetters.map((letter, i) => (
            <li key={i}>
              <button
                onClick={() => downloadFile(letter, `offer_letter_${i + 1}.pdf`)}
                className="text-blue-600 underline hover:text-blue-800"
              >
                Download Offer Letter {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </li>
    )}

    {Array.isArray(profile.nid) ? (
      profile.nid.length > 0 && (
        <li>
          NID:
          <ul className="ml-4 list-disc">
            {profile.nid.map((nid, i) => (
              <li key={i}>
                <button
                  onClick={() => downloadFile(nid, `nid_${i + 1}.pdf`)}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Download NID {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </li>
      )
    ) : (
      profile.nid && (
        <li>
          NID:{" "}
          <button
            onClick={() => downloadFile(profile.nid, "nid.pdf")}
            className="text-blue-600 underline hover:text-blue-800"
          >
            Download
          </button>
        </li>
      )
    )}

    {profile.bills?.length > 0 && (
      <li>
        Bills:
        <ul className="ml-4 list-disc">
          {profile.bills.map((bill, i) => (
            <li key={i}>
              <button
                onClick={() => downloadFile(bill, `bill_${i + 1}.pdf`)}
                className="text-blue-600 underline hover:text-blue-800"
              >
                Download Bill {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </li>
    )}
  </ul>
</div>
</div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <div className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-800">
      {value || "N/A"}
    </div>
  </div>
);

export default StudentProfile;
