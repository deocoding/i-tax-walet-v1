import React, { useContext, useEffect, useState } from "react";
import AppLayout from "../../../components/layouts/app/AppLayout";
import dynamic from "next/dynamic";
import { Store } from "../../../utils/Store";
import { useRouter } from "next/router";
import Link from "next/link";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
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
    { value: "", label: "Semua" },
    { value: "bulan", label: "Bulanan" },
    { value: "triwulan", label: "Triwulan" },
    { value: "semester", label: "Semester" },
    { value: "tahun", label: "Tahunan" },
  ];
  const handleChangeTipe = (selectedOptionTipe) => {
    setSelectedOptionTipe(selectedOptionTipe);
    setValue("tipe", selectedOptionTipe.value);
  };

  const [selectedOptionTahun, setSelectedOptionTahun] = useState(null);
  const optionsTahun = [
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

  const [selectedOptionBulan, setSelectedOptionBulan] = useState(null);
  const optionsBulan = [
    { value: 1, label: "Januari" },
    { value: 2, label: "Februari" },
    { value: 3, label: "Maret" },
    { value: 4, label: "April" },
    { value: 5, label: "Mei" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "Agustus" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" },
  ];
  const handleChangeBulan = (selectedOptionBulan) => {
    setSelectedOptionBulan(selectedOptionBulan);
    setSelectedOptionTriwulan(false);
    setSelectedOptionSemester(false);
    setValue("bulan", selectedOptionBulan.value);
    setValue("triwulan", false);
    setValue("semester", false);
  };

  const [selectedOptionTriwulan, setSelectedOptionTriwulan] = useState(null);
  const optionsTriwulan = [
    { value: 1, label: "I" },
    { value: 2, label: "II" },
    { value: 3, label: "III" },
    { value: 4, label: "IV" },
  ];
  const handleChangeTriwulan = (selectedOptionTriwulan) => {
    setSelectedOptionTriwulan(selectedOptionTriwulan);
    setSelectedOptionBulan(false);
    setSelectedOptionSemester(false);
    setValue("triwulan", selectedOptionTriwulan.value);
    setValue("bulan", false);
    setValue("semester", false);
  };

  const [selectedOptionSemester, setSelectedOptionSemester] = useState(null);
  const optionsSemester = [
    { value: 1, label: "I" },
    { value: 2, label: "II" },
  ];
  const handleChangeSemester = (selectedOptionSemester) => {
    setSelectedOptionSemester(selectedOptionSemester);
    setSelectedOptionBulan(false);
    setSelectedOptionTriwulan(false);
    setValue("semester", selectedOptionSemester.value);
    setValue("bulan", false);
    setValue("triwulan", false);
  };

  const [laporans, setLaporans] = useState([]);
  const [tipeLap, setTipeLap] = useState(null);
  const [tahunLap, setTahunLap] = useState(null);
  const [bulanLap, setBulanLap] = useState(null);
  const [triwulanLap, setTriwulanLap] = useState(null);
  const [semesterLap, setSemesterLap] = useState(null);

  const laporanHandler = async ({ tipe, tahun, bulan, triwulan, semester }) => {
    try {
      const res = await axios.post(
        "/api/laporans/pajaks",
        { tipe, tahun, bulan, triwulan, semester },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (res.data.laporans) {
        exportToExcel(
          res.data.laporans,
          res.data.imageString,
          res.data.tipe,
          res.data.tahun,
          res.data.bulan,
          res.data.triwulan,
          res.data.semester
        );

        // setLaporans(res.data.laporans);
        // setTipeLap(res.data.tipe);
        // setTahunLap(res.data.tahun);
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
    dataTahun,
    dataBulan,
    dataTriwulan,
    dataSemester
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
      tl: { col: 0.8, row: 1 },
      ext: { width: 105, height: 125 },
    });

    let columnArr = [];

    for (let i in data[0]) {
      let tempObj = { name: "" };

      switch (i) {
        case "_id":
          tempObj.name = null;
          break;
        case "no":
          tempObj.name = "No";
          break;
        case "nama":
          tempObj.name = "Nama Lengkap";
          break;
        case "npwpd":
          tempObj.name = "NPWPD";
          break;
        case "alamat":
          tempObj.name = "Alamat Lengkap";
          break;
        case "kec":
          tempObj.name = "Kecamatan";
          break;
        case "hpTel":
          tempObj.name = "No. HP/Telpon";
          break;
        case "volTon":
          tempObj.name = "Volume/Tonase";
          tempObj.totalsRowFunction = "sum";
          tempObj.filterButton = false;
          break;
        case "nilJual":
          tempObj.name = "Nilai Jual";
          tempObj.totalsRowFunction = "sum";
          tempObj.filterButton = false;
          break;
        case "tgglJual":
          tempObj.name = "Tanggal Jual";
          break;
        case "totJual":
          tempObj.name = "Total Jual";
          tempObj.totalsRowFunction = "sum";
          tempObj.filterButton = false;
          break;
        case "totPajak":
          tempObj.name = "Pokok Pajak";
          tempObj.totalsRowFunction = "sum";
          tempObj.filterButton = false;
          break;
        case "jumBayar":
          tempObj.name = "Jumlah Bayar";
          tempObj.totalsRowFunction = "sum";
          tempObj.filterButton = false;
          break;
        case "tgglBayar":
          tempObj.name = "Tanggal Bayar";
          break;
        case "sttsPajak":
          tempObj.name = "Status Bayar";
          break;
        default:
          tempObj.name = i;
      }
      columnArr.push(tempObj);
    }

    sheet.addTable({
      name: headerName,
      ref: "A8",
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
      namaTahun = dataTahun;
      gantungan = "Bulan";
      namaGantungan = dataBulan;
      fileLaporan = `bln_${dataBulan}_${dataTahun}`;
    } else if (dataTipe == "triwulan") {
      namaTipeLaporan = "TRIWULAN";
      namaTahun = dataTahun;
      gantungan = "Triwulan";
      namaGantungan = dataTriwulan;
      fileLaporan = `tw_${dataTriwulan}_${dataTahun}`;
    } else if (dataTipe == "semester") {
      namaTipeLaporan = "SEMESTER";
      namaTahun = dataTahun;
      gantungan = "Semester";
      namaGantungan = dataSemester;
      fileLaporan = `smstr_${dataSemester}_${dataTahun}`;
    } else if (dataTipe == "tahun") {
      namaTipeLaporan = "TAHUNAN";
      namaTahun = dataTahun;
      gantungan = "Bulan";
      namaGantungan = "Semua";
      fileLaporan = `thn_${dataTahun}`;
    } else {
      namaTipeLaporan = "KESELURUHAN";
      namaTahun = "Semua";
      namaGantungan = "Semua";
      gantungan = "Bulan";
      fileLaporan = `semua`;
    }

    sheet.getCell("C4").font = { size: 12, bold: true };
    sheet.getCell(
      "C4"
    ).value = `REKAPITULASI PAJAK USAHA SARANG BURUNG WALET ${namaTipeLaporan}`;
    sheet.getCell("C4").alignment = {
      vertical: "left",
      horizontal: "middle",
    };

    sheet.getCell("C5").font = { size: 12, bold: true };
    sheet.getCell("C5").value = "Tahun";
    sheet.getCell("C5").alignment = {
      vertical: "left",
      horizontal: "middle",
    };
    sheet.getCell("D5").font = { size: 12, bold: true };
    sheet.getCell("D5").value = `: ${namaTahun}`;
    sheet.getCell("D5").alignment = {
      vertical: "left",
      horizontal: "middle",
    };

    sheet.getCell("C6").font = { size: 12, bold: true };
    sheet.getCell("C6").value = `${gantungan}`;
    sheet.getCell("C6").alignment = {
      vertical: "left",
      horizontal: "middle",
    };
    sheet.getCell("D6").font = { size: 12, bold: true };
    sheet.getCell("D6").value = `: ${namaGantungan}`;
    sheet.getCell("D6").alignment = {
      vertical: "left",
      horizontal: "middle",
    };

    sheet.columns = sheet.columns.map((e) => {
      const expr = e.values[8];
      switch (expr) {
        case "No":
          return { width: 8 };
        case "nama":
          return { width: 20 };
        case "npwpd":
          return { width: 15 };
        case "alamat":
          return { width: 30 };
        default:
          return { width: 20 };
      }
    });

    sheet.getRow(8).height = 42.5;

    const table = sheet.getTable(headerName);
    for (let i = 0; i < table.table.columns.length; i++) {
      sheet.getCell(`${String.fromCharCode(65 + i)}8`).font = { size: 12 };
      sheet.getCell(`${String.fromCharCode(65 + i)}8`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "c5d9f1" },
      };
      sheet.getCell(`${String.fromCharCode(65 + i)}8`).alignment = {
        wrapText: true,
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getCell(`${String.fromCharCode(65 + i)}8`).border = {
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
        let rowCell = sheet.getCell(`${String.fromCharCode(65 + i)}${j + 9}`);

        if (i == 7 || i == 9 || i == 10 || i == 11) {
          rowCell.style = { numFmt: '"Rp"#,##0.00;[Red]-"Rp"#,##0.00' };
          rowCell.alignment = {
            wrapText: true,
            vertical: "top",
            horizontal: "right",
          };
        } else if (i == 1 || i == 3) {
          rowCell.alignment = {
            wrapText: true,
            vertical: "top",
            horizontal: "left",
          };
        } else {
          rowCell.alignment = {
            wrapText: true,
            vertical: "top",
            horizontal: "center",
          };
        }
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
      writeFile(`rekap_pajak_${fileLaporan}.xlsx`, buffer);
    });
  };

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
          <li>Pembayaran Pajak</li>
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
                  <h5>Pembayaran Pajak</h5>
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
                  {selectedOptionTipe && selectedOptionTipe.value != "" && (
                    <div className="flex items-center mt-5">
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
                  )}

                  {selectedOptionTipe && selectedOptionTipe.value == "bulan" && (
                    <div className="flex items-center mt-5">
                      <div className="w-1/4">
                        <label className="label block">Bulan ke</label>
                      </div>
                      <div className="w-3/4 ml-2">
                        <Controller
                          control={control}
                          name="bulan"
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Select
                              options={optionsBulan}
                              value={selectedOptionBulan}
                              placeholder="Pilih bulan..."
                              onChange={handleChangeBulan}
                            />
                          )}
                        />
                        <small className="block my-2 invalid-feedback">
                          {errors.bulan?.type === "required" &&
                            "Field diatas tidak boleh kosong"}
                        </small>
                      </div>
                    </div>
                  )}

                  {selectedOptionTipe &&
                    selectedOptionTipe.value == "triwulan" && (
                      <div className="flex items-center mt-5">
                        <div className="w-1/4">
                          <label className="label block">Triwulan ke</label>
                        </div>
                        <div className="w-3/4 ml-2">
                          <Controller
                            control={control}
                            name="triwulan"
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Select
                                value={selectedOptionTriwulan}
                                onChange={handleChangeTriwulan}
                                options={optionsTriwulan}
                                placeholder="Pilih triwulan..."
                              />
                            )}
                          />
                          <small className="block my-2 invalid-feedback">
                            {errors.triwulan?.type === "required" &&
                              "Field diatas tidak boleh kosong"}
                          </small>
                        </div>
                      </div>
                    )}

                  {selectedOptionTipe &&
                    selectedOptionTipe.value == "semester" && (
                      <div className="flex items-center mt-5">
                        <div className="w-1/4">
                          <label className="label block">Semester ke</label>
                        </div>
                        <div className="w-3/4 ml-2">
                          <Controller
                            control={control}
                            name="semester"
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Select
                                value={selectedOptionSemester}
                                onChange={handleChangeSemester}
                                options={optionsSemester}
                                placeholder="Pilih semester..."
                              />
                            )}
                          />
                          <small className="block my-2 invalid-feedback">
                            {errors.semester?.type === "required" &&
                              "Field diatas tidak boleh kosong"}
                          </small>
                        </div>
                      </div>
                    )}

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
