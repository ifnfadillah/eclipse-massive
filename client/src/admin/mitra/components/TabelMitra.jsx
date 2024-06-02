import React, { useState, useEffect } from 'react';
import Button from '@/admin/components/Button';
import PopupDelete from '@/admin/components/pop-up/PopupDelete';
import Pagination from '@/admin/components/Pagination';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TableMitra = ({ itemName }) => {
    const [data, setData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        axios.get('http://localhost:3001/mitra')
            .then(res => setData(res.data))
            .catch(err => { console.log(err); });
    }, []);

    const handleDelete = (mitraId) => {
        setItemToDelete(mitraId);
        setIsOpen(true);
    };

    const handleConfirm = () => {
        setIsOpen(false);
        if (itemToDelete !== null) {
            axios.delete(`http://localhost:3001/mitra/delete/${itemToDelete}`)
                .then(() => {
                    const newData = data.filter(mitra => mitra.id !== itemToDelete);
                    setData(newData);
                    console.log('Item dihapus', newData);
                })
                .catch(err => console.log(err));
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const renderData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    };

    const totalPages = Math.ceil(data.length / itemsPerPage);

    return (
        <>
            <div className="bg-white relative shadow-sm sm:rounded-lg rounded-lg overflow-hidden">
                <div className="overflow-x-auto" id="searchResults">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-sm text-white font-primary font-medium bg-sky-700">
                            <tr>
                                <th scope="col" className="px-10 py-6 ">No</th>
                                <th scope="col" className="px-12 py-6 ">Nama Mitra</th>
                                <th scope="col" className="px-12 py-6 ">Logo</th>
                                <th scope="col" className="px-12 py-6 ">
                                    <span className="sr-only">Action</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center p-6 text-gray-500">Belum ada data</td>
                                </tr>
                            ) : (
                                renderData().map((mitra, index) => (
                                    <tr className="border border-gray-200" key={index}>
                                        <td className="font-primary text-xs font-regular text-gray-800 px-10 py-4 max-w-xs truncate">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                        <td className="font-primary text-xs font-regular text-gray-800 px-12 py-4 max-w-xs truncate">{mitra.nama}</td>
                                        <td className="font-primary text-xs font-regular text-gray-800 px-12 py-4 max-w-xs truncate">{mitra.logo}</td>
                                        <td className="px-12 py-3 flex items-center justify-end space-x-4">
                                            <Link to={`/data-mitra/edit/${mitra.id}`}>
                                                <Button
                                                    classname="h-9 w-20 font-secondary text-xs rounded-3xl font-medium bg-amber-300 hover:bg-amber-400 text-black"
                                                    type="button"
                                                >
                                                    Ubah
                                                </Button>
                                            </Link>
                                            <Button
                                                onClick={() => handleDelete(mitra.id)}
                                                classname="h-9 w-20 font-secondary text-xs rounded-3xl font-medium bg-red-500 hover:bg-red-600 text-white"
                                                type="button"
                                            >
                                                Hapus
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {data.length > 0 && (
                <div className="flex justify-center mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
            {isOpen && (
                data.map((mitra, index) => (
                    <PopupDelete
                        key={index}
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                        itemName={mitra.nama}
                    />
                ))
            )}
        </>
    );
};

export default TableMitra;