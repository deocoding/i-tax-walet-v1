import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AdminLayout from "../../../components/layouts/admin/AdminLayout";
import { Store } from "../../../utils/Store";
import { getError } from "../../../utils/error";

export default function UserDetail() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordIcon, setPasswordIcon] = useState(false);

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
    setPasswordIcon(!passwordIcon);
  };

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    }
  }, []);

  const userHandler = async ({
    npwpd,
    email,
    password,
    namaLengkap,
    hpTel,
    alamatDetail,
    alamatKec,
    status,
  }) => {
    try {
      const { data } = await axios.post(
        "/api/admin/users/add",
        {
          npwpd,
          email,
          password,
          namaLengkap,
          hpTel,
          alamatDetail,
          alamatKec,
          status,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (data) {
        router.push("/admin/users");
      }
    } catch (err) {
      alert(getError(err));
    }
  };

  return (
    <AdminLayout title="User">
      {/* <!-- Breadcrumb --> */}
      <section className="breadcrumb">
        <h1>User</h1>
        <ul>
          <li>
            <span>Admin</span>
          </li>
          <li className="divider las las-arrow-right"></li>
          <li>Tambah User</li>
        </ul>
      </section>

      <div className="flex">
        {/* <!-- Content --> */}
        <div className="w-full">
          <div className="card p-5">
            <form onSubmit={handleSubmit(userHandler)}>
              <div className="mb-5">
                <label className="label block mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  className="form-control"
                  {...register("email", { required: true })}
                  autoFocus={!0}
                />
                <small className="block my-2 invalid-feedback">
                  {errors.email?.type === "required" &&
                    "Field diatas tidak boleh kosong"}
                </small>
              </div>

              <div className="mb-5">
                <label className="label block mb-2" htmlFor="password">
                  Password
                </label>
                <label className="form-control-addon-within">
                  <input
                    {...register("password", { required: true })}
                    type={passwordShown ? "text" : "password"}
                    className="form-control border-none"
                  />
                  <span className="flex items-center ltr:pr-4 rtl:pl-4">
                    <button
                      type="button"
                      className={
                        passwordIcon
                          ? "btn-link text-primary dark:text-gray-600 las las-eye text-xl leading-none"
                          : "btn-link text-gray-600 dark:text-primary las las-eye-slash text-xl leading-none"
                      }
                      onClick={togglePassword}
                    ></button>
                  </span>
                </label>
                <small className="block my-2 invalid-feedback">
                  {errors.password?.type === "required" &&
                    "Field diatas tidak boleh kosong"}
                </small>
              </div>

              <div className="mb-5">
                <label className="label block mb-2" htmlFor="namaLengkap">
                  Nama Lengkap
                </label>
                <input
                  id="namaLengkap"
                  type="text"
                  className="form-control"
                  {...register("namaLengkap", { required: true })}
                />
                <small className="block my-2 invalid-feedback">
                  {errors.namaLengkap?.type === "required" &&
                    "Field diatas tidak boleh kosong"}
                </small>
              </div>

              <div className="mb-5">
                <label className="label block mb-2" htmlFor="hptelpon">
                  Nomor HP/Telpon
                </label>
                <input
                  id="hptelpon"
                  type="text"
                  className="form-control"
                  {...register("hpTel", { required: true })}
                />
                <small className="block my-2 invalid-feedback">
                  {errors.hpTel?.type === "required" &&
                    "Field diatas tidak boleh kosong"}
                </small>
              </div>

              <div className="mb-5">
                <label className="label block mb-2" htmlFor="alamatLengkap">
                  Alamat Lengkap
                </label>
                <textarea
                  id="alamatLengkap"
                  className="form-control"
                  {...register("alamatDetail", { required: true })}
                  rows="16"
                ></textarea>
                <small className="block my-2 invalid-feedback">
                  {errors.alamatDetail?.type === "required" &&
                    "Field diatas tidak boleh kosong"}
                </small>
              </div>

              <div className="mb-5">
                <label className="label block mb-2" htmlFor="kecamatan">
                  Kecamatan
                </label>
                <div className="custom-select">
                  <select
                    className="form-control"
                    {...register("alamatKec", { required: true })}
                  >
                    <option value="">Pilih kecamatan</option>
                    <option value="Pahandut">Pahandut</option>
                    <option value="Jekan Raya">Jekan Raya</option>
                    <option value="Sabangau">Sabangau</option>
                    <option value="Bukit Batu">Bukit Batu</option>
                    <option value="Rakumpit">Rakumpit</option>
                  </select>
                  <div className="custom-select-icon las las-caret-down"></div>
                </div>
                <small className="block my-2 invalid-feedback">
                  {errors.alamatKec?.type === "required" &&
                    "Field diatas tidak boleh kosong"}
                </small>
              </div>

              <div className="mb-5">
                <label className="label block mb-2" htmlFor="kecamatan">
                  Status
                </label>
                <div className="custom-select mt-3">
                  <select
                    className="form-control"
                    {...register("status", { required: true })}
                  >
                    <option value={1}>Pendaftaran</option>
                    <option value={2}>Pendataan</option>
                    <option value={3}>Valid</option>
                  </select>
                  <div className="custom-select-icon las las-caret-down"></div>
                </div>
              </div>

              <hr />
              <div className="flex items-center">
                <button
                  className="btn btn_primary mt-5 ltr:mr-2 rtl:ml-2 uppercase"
                  type="submit"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
