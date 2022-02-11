import React, { useContext, useEffect, useState } from "react";
import AppLayout from "../../../components/layouts/app/AppLayout";
import dynamic from "next/dynamic";
import { Store } from "../../../utils/Store";
import { useRouter } from "next/router";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import axios from "axios";
import ExcelJs from "exceljs";

function Laporans() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      tipe: false,
      tahun: false,
      bulan: false,
      triwulan: false,
      semester: false,
    },
  });

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    }
  });

  const [selectedOptionTahun, setSelectedOptionTahun] = useState(null);
  const optionsTahun = [
    { value: "semua", label: "Semua" },
    { value: 2022, label: "2022" },
    { value: 2021, label: "2021" },
    { value: 2020, label: "2020" },
    { value: 2019, label: "2019" },
    { value: 2018, label: "2018" },
    { value: 2017, label: "2017" },
  ];
  const handleChangeTahun = (selectedOptionTahun) => {
    setSelectedOptionTahun(selectedOptionTahun);
    setValue("tahun", selectedOptionTahun.value);
  };

  const [laporans, setLaporans] = useState([]);

  const laporanHandler = async ({ tahun }) => {
    try {
      const res = await axios.post(
        "/api/laporans/sebarans",
        { tahun },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (res.data.laporans) {
        exportToExcel(res.data.laporans, res.data.imageString, res.data.tahun);

        // setLaporans(res.data.laporans);
      } else {
        alert(res.data.pesan);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const exportToExcel = (data, image, dataTahun) => {
    let sheetName = "Sheet1";
    let headerName = "RequestsList";

    let workbook = new ExcelJs.Workbook();
    let sheet = workbook.addWorksheet(sheetName, {
      views: [{ showGridLines: false }],
      pageSetup: { paperSize: 5, orientation: "landscape", fitToWidth: true },
    });
    sheet.pageSetup.margins = {
      left: 0.7,
      right: 0.7,
      top: 0.5,
      bottom: 0.25,
      header: 0.3,
      footer: 0.3,
    };

    // add image to workbook by base64
    const myBase64Image = image;
    const imageId2 = workbook.addImage({
      base64: myBase64Image,
      extension: "jpg",
    });
    sheet.addImage(imageId2, {
      tl: { col: 1, row: 1 },
      ext: { width: 65, height: 85 },
    });

    let columnArr = [];

    for (let i in data[0]) {
      let tempObj = { name: "" };

      switch (i) {
        case "no":
          tempObj.name = "No";
          break;
        case "kec":
          tempObj.name = "Kecamatan";
          break;
        case "volTon":
          tempObj.name = " Total Volume/Tonase";
          tempObj.totalsRowFunction = "sum";
          tempObj.filterButton = false;
          break;
        case "totJual":
          tempObj.name = "Total Penjualan";
          tempObj.totalsRowFunction = "sum";
          tempObj.filterButton = false;
          break;
        case "totPajak":
          tempObj.name = "Total Pajak";
          tempObj.totalsRowFunction = "sum";
          tempObj.filterButton = false;
          break;
        case "totBayar":
          tempObj.name = "Total Bayar";
          tempObj.totalsRowFunction = "sum";
          tempObj.filterButton = false;
          break;
        case "totPop":
          tempObj.name = "Total Populasi";
          tempObj.totalsRowFunction = "sum";
          tempObj.filterButton = false;
          break;
        case "bnykObjek":
          tempObj.name = "Banyak Bangunan";
          tempObj.totalsRowFunction = "sum";
          tempObj.filterButton = false;
          break;
        default:
          tempObj.name = i;
      }
      columnArr.push(tempObj);
    }

    sheet.addTable({
      name: headerName,
      ref: "A6",
      headerRow: true,
      totalsRow: true,
      style: {
        theme: "TableStyleMedium2",
        showRowStripes: false,
        width: 200,
      },
      columns: columnArr ? columnArr : [{ name: "" }],
      rows: data.map((e) => {
        let arr = [];
        for (let i in e) {
          arr.push(e[i]);
        }
        return arr;
      }),
    });

    sheet.getCell("C2").font = { size: 20, bold: true };
    sheet.getCell("C2").value = "PEMERINTAH KOTA PALANGKA RAYA";
    sheet.getCell("C2").alignment = {
      vertical: "left",
      horizontal: "middle",
    };

    sheet.getCell("C3").font = { size: 16, bold: true };
    sheet.getCell("C3").value = "BADAN PENGELOLA PAJAK DAN RETRIBUSI DAERAH";
    sheet.getCell("C3").alignment = {
      vertical: "left",
      horizontal: "middle",
    };

    let namaTipeLaporan =
      dataTahun !== "semua" ? `TAHUN ${dataTahun}` : `KESELURUHAN`;
    let fileLaporan = dataTahun ? dataTahun : "semua";

    sheet.getCell("C4").font = { size: 12, bold: true };
    sheet.getCell(
      "C4"
    ).value = `SEBARAN OBJEK PAJAK USAHA SARANG BURUNG WALET ${namaTipeLaporan}`;
    sheet.getCell("C4").alignment = {
      vertical: "left",
      horizontal: "middle",
    };

    sheet.columns = sheet.columns.map((e) => {
      const expr = e.values[6];
      switch (expr) {
        case "No":
          return { width: 8 };
        case "Tahun":
          return { width: 15 };
        case "Bulan":
          return { width: 15 };
        default:
          return { width: 20 };
      }
    });

    sheet.getRow(7).height = 42.5;

    const table = sheet.getTable(headerName);
    const baris_akhir = sheet.lastRow._number;
    for (let i = 0; i < table.table.columns.length; i++) {
      sheet.getCell(`${String.fromCharCode(65 + i)}6`).font = { size: 12 };
      sheet.getCell(`${String.fromCharCode(65 + i)}6`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "c5d9f1" },
      };
      sheet.getCell(`${String.fromCharCode(65 + i)}6`).alignment = {
        wrapText: true,
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getCell(`${String.fromCharCode(65 + i)}6`).border = {
        bottom: {
          style: "thin",
          color: { argb: "a6a6a6" },
        },
        top: {
          style: "thin",
          color: { argb: "a6a6a6" },
        },
        left: {
          style: "thin",
          color: { argb: "a6a6a6" },
        },
        right: {
          style: "thin",
          color: { argb: "a6a6a6" },
        },
      };

      for (let j = 0; j < table.table.rows.length + 1; j++) {
        let rowCell = sheet.getCell(`${String.fromCharCode(65 + i)}${j + 7}`);

        if (i == 5 || i == 6 || i == 7) {
          rowCell.style = { numFmt: '"Rp"#,##0.00;[Red]-"Rp"#,##0.00' };
          rowCell.alignment = {
            wrapText: true,
            vertical: "top",
            horizontal: "right",
          };
        }

        rowCell.alignment = {
          wrapText: true,
          vertical: "top",
          horizontal: "center",
        };
        rowCell.border = {
          bottom: {
            style: "thin",
            color: { argb: "a6a6a6" },
          },
          top: {
            style: "thin",
            color: { argb: "a6a6a6" },
          },
          left: {
            style: "thin",
            color: { argb: "a6a6a6" },
          },
          right: {
            style: "thin",
            color: { argb: "a6a6a6" },
          },
        };
      }
    }

    table.commit();

    const writeFile = (fileName, content) => {
      const link = document.createElement("a");
      const blob = new Blob([content], {
        type: "application/vnd.ms-excel;charset=utf-8;",
      });
      link.download = fileName;
      link.href = URL.createObjectURL(blob);
      link.click();
    };

    workbook.xlsx.writeBuffer().then((buffer) => {
      writeFile(`sebaran_kec_${fileLaporan}.xlsx`, buffer);
    });
  };

  // console.log(laporans);

  return (
    <AppLayout title="Laporan">
      <section className="breadcrumb lg:flex items-start">
        <div>
          <h1>Laporan</h1>
          <ul>
            <li>
              <a>
                {userInfo && userInfo.role == 1 && <span>Superadmin</span>}
                {userInfo && userInfo.role == 2 && <span>Admin</span>}
                {userInfo && userInfo.role == 3 && <span>Surveyor</span>}
                {userInfo && userInfo.role == 4 && <span>Operator</span>}
              </a>
            </li>
            <li className="divider las las-arrow-right"></li>
            <li>Daftar Laporan</li>
          </ul>
        </div>
      </section>

      <div className="breadcrumb breadcrumb_alt mt-5 p-4">
        <ul>
          <li>
            <Link href="/laporans" passHref>
              <a>
                <span className="las las-folder text-xl ltr:mr-2 rtl:ml-2"></span>
                Utama
              </a>
            </Link>
          </li>
          <li className="divider las las-arrow-right"></li>
          <li>Sebaran per Kecamatan</li>
        </ul>
      </div>

      <div className="lg:flex lg:-mx-4 mt-5">
        <div className="lg:w-full lg:px-4">
          <div className="sm:flex sm:flex-wrap sm:-mx-4">
            {/* Folder Laporan Pajak */}
            <div className="sm:w-1/2 lg:w-1/3 mb-5 sm:px-4">
              <div className="card card_hoverable card_list cursor-pointer">
                <div className="image image_icon">
                  <span className="las las-file-excel las-4x"></span>
                </div>
                <div className="body">
                  <h5>Sebaran per Kecamatan</h5>
                </div>
              </div>
            </div>
            {/* Folder Laporan Prediksi */}
            <div className="sm:w-1/2 lg:w-1/3 mb-5 sm:px-4">
              <div className="relative card p-5">
                <form className="mt-5" onSubmit={handleSubmit(laporanHandler)}>
                  <div className="flex items-center">
                    <div className="w-1/4">
                      <label className="label block">Tahun</label>
                    </div>
                    <div className="w-3/4 ml-2">
                      <Controller
                        control={control}
                        name="tahun"
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            options={optionsTahun}
                            value={selectedOptionTahun}
                            onChange={handleChangeTahun}
                            placeholder="Pilih tahun..."
                          />
                        )}
                      />
                      <small className="block my-2 invalid-feedback">
                        {errors.tahun?.type === "required" &&
                          "Field diatas tidak boleh kosong"}
                      </small>
                    </div>
                  </div>

                  <div className="mt-5">
                    <button
                      type="submit"
                      className="btn btn_primary mt-5 ltr:mr-2 rtl:ml-2 uppercase"
                    >
                      Download
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default dynamic(() => Promise.resolve(Laporans), { ssr: false });
