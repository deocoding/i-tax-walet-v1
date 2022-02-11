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

  const [selectedOptionTipe, setSelectedOptionTipe] = useState(null);
  const optionsTipe = [
    { value: "bulan", label: "Bulanan" },
    { value: "tahun", label: "Tahunan" },
  ];
  const handleChangeTipe = (selectedOptionTipe) => {
    setSelectedOptionTipe(selectedOptionTipe);
    setValue("tipe", selectedOptionTipe.value);
  };

  const [laporans, setLaporans] = useState([]);

  const laporanHandler = async ({ tipe }) => {
    try {
      const res = await axios.post(
        "/api/laporans/prediksis",
        { tipe },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (res.data.laporans) {
        exportToExcel(
          res.data.laporans,
          res.data.imageString,
          res.data.tipe,
          res.data.prediksiRupiah,
          res.data.prediksiBulat
        );

        // setLaporans(res.data.laporans);
      } else {
        alert(res.data.pesan);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const exportToExcel = (
    data,
    image,
    dataTipe,
    prediksiRupiah,
    prediksiPersen
  ) => {
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
        case "tahun":
          tempObj.name = "Tahun";
          break;
        case "bulan":
          tempObj.name = "Bulan";
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
        case "x":
          tempObj.name = "X";
          tempObj.totalsRowFunction = "sum";
          tempObj.filterButton = false;
          break;
        case "xy":
          tempObj.name = "XY";
          tempObj.totalsRowFunction = "sum";
          tempObj.filterButton = false;
          break;
        case "x2":
          tempObj.name = "X2";
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

    let namaTipeLaporan = "";
    let namaTahun = "";
    let namaGantungan = "";
    let gantungan = "";
    let fileLaporan = "";
    if (dataTipe == "bulan") {
      namaTipeLaporan = "BULANAN";
      fileLaporan = `blnan`;
    } else if (dataTipe == "tahun") {
      namaTipeLaporan = "TAHUNAN";
      fileLaporan = `thnan`;
    } else {
      namaTipeLaporan = "KESELURUHAN";
      namaTahun = "Semua";
      namaGantungan = "";
      gantungan = "";
      fileLaporan = `semua`;
    }

    sheet.getCell("C4").font = { size: 12, bold: true };
    sheet.getCell(
      "C4"
    ).value = `PREDIKSI POTENSI PAJAK USAHA SARANG BURUNG WALET ${namaTipeLaporan}`;
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

        if (dataTipe == "tahun") {
          if (i == 3 || i == 4 || i == 5 || i == 7) {
            rowCell.style = { numFmt: '"Rp"#,##0.00;[Red]-"Rp"#,##0.00' };
            rowCell.alignment = {
              wrapText: true,
              vertical: "top",
              horizontal: "right",
            };
          }
        } else {
          if (i == 4 || i == 5 || i == 6 || i == 8) {
            rowCell.style = { numFmt: '"Rp"#,##0.00;[Red]-"Rp"#,##0.00' };
            rowCell.alignment = {
              wrapText: true,
              vertical: "top",
              horizontal: "right",
            };
          }
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

    sheet.getCell(`C${baris_akhir + 2}`).font = { size: 12, bold: true };
    sheet.getCell(`C${baris_akhir + 2}`).value = `Prediksi Potensi Pajak`;
    sheet.getCell(`C${baris_akhir + 2}`).alignment = {
      vertical: "left",
      horizontal: "middle",
    };

    sheet.getCell(`C${baris_akhir + 3}`).value = `Dalam Rupiah :`;
    sheet.getCell(`C${baris_akhir + 3}`).alignment = {
      vertical: "left",
      horizontal: "middle",
    };
    sheet.getCell(`D${baris_akhir + 3}`).value = prediksiRupiah;
    sheet.getCell(`D${baris_akhir + 3}`).style = {
      numFmt: '"Rp"#,##0.00;[Red]-"Rp"#,##0.00',
    };

    sheet.getCell(`C${baris_akhir + 4}`).value = `Dalam Persen :`;
    sheet.getCell(`C${baris_akhir + 4}`).alignment = {
      vertical: "left",
      horizontal: "middle",
    };
    sheet.getCell(`D${baris_akhir + 4}`).value = `${prediksiPersen}%`;
    sheet.getCell(`D${baris_akhir + 4}`).style = {
      numFmt: '#,##0.00"%";[Red]-#,##0.00"%"',
    };
    sheet.getCell(`D${baris_akhir + 4}`).alignment = {
      vertical: "top",
      horizontal: "right",
    };

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
      writeFile(`prediksi_potensi_${fileLaporan}.xlsx`, buffer);
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
          <li>Prediksi Pajak</li>
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
                  <h5>Prediksi Pajak</h5>
                </div>
              </div>
            </div>
            {/* Folder Laporan Prediksi */}
            <div className="sm:w-1/2 lg:w-1/3 mb-5 sm:px-4">
              <div className="relative card p-5">
                <form className="mt-5" onSubmit={handleSubmit(laporanHandler)}>
                  <div className="flex items-center">
                    <div className="w-1/4">
                      <label className="label block">Tipe</label>
                    </div>
                    <div className="w-3/4 ml-2">
                      <Controller
                        control={control}
                        name="tipe"
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            options={optionsTipe}
                            value={selectedOptionTipe}
                            onChange={handleChangeTipe}
                            placeholder="Pilih tipe..."
                          />
                        )}
                      />
                      <small className="block my-2 invalid-feedback">
                        {errors.tipe?.type === "required" &&
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
