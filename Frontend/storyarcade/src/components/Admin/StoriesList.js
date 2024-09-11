import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsTrashFill } from "react-icons/bs";

export default function StoriesList() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3500/story/getAllStories")
      .then((result) => setStories(result.data))
      .catch((err) => console.log(err));
  }, []);

  const deleteAdmin = (id) => {
    axios
      .delete("http://localhost:3500/story/adminDelete/" + id)
      .then((result) => window.location.reload())
      .catch((err) => console.log(err));
  };

  return (
    <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
      <div className="overflow-x-auto">
        <table className=" min-w-full table-auto divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Access Level
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Uploader
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Tags
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {stories?.map((story) => (
              <tr key={story._id} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate">
                  <div className="text-sm font-medium text-white">
                    {story.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    ${story.access_level}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{story.uploader}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate">
                  <div className="text-sm text-gray-300">{story.tags}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <BsTrashFill
                    onClick={() => deleteAdmin(story._id)}
                    className="text-red-400 hover:text-red-300"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
