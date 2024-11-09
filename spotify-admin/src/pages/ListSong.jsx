import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa6';

const ListSong = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSongs = async () => {
    try {
      const response = await axios.get('/api/v1/song/list');

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      toast.error('Error Occur');
    }
  };

  const removeSong = async (id) => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/v1//song/remove/${id}`);

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchSongs();
      }
    } catch (error) {
      toast.error('Error occur');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return loading ? (
    <div className="grid place-items-center min-h-[80vh]">
      <div className="w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full animate-spin"></div>
    </div>
  ) : (
    <div>
      <p>All Songs List</p>
      <br />
      <div>
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border-gray-300 text-sm mr-5 bg-gray-100">
          <b>Image</b>
          <b>Name</b>
          <b>Album</b>
          <b>Duration</b>
          <b>Action</b>
        </div>
        {console.log(data)}
        {data.map((item, index) => {
          return (
            <div
              key={index}
              className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5">
              <img className="w-12" src={item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.album}</p>
              <p>{item.duration}</p>
              <p className="cursor-pointer" onClick={() => removeSong(item._id)}>
                <FaTrash />
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListSong;
