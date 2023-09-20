import { Fragment } from "react";

const Home = () => {
  return (
    <Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 className="mb-sm-0 font-size-18">Horizontal</h4>

                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <a>Layouts</a>
                    </li>
                    <li className="breadcrumb-item active">Horizontal</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-3 col-md-6">
              <div className="card card-h-100">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-6">
                      <span className="text-muted mb-3 lh-1 d-block text-truncate">
                        My Wallet
                      </span>
                      <h4 className="mb-3">
                        $
                        <span className="counter-value" data-target="865.2">
                          0
                        </span>
                        k
                      </h4>
                    </div>

                    <div className="col-6">
                      <div
                        id="mini-chart1"
                        data-colors='["#5156be"]'
                        className="apex-charts mb-2"
                      ></div>
                    </div>
                  </div>
                  <div className="text-nowrap">
                    <span className="badge bg-soft-success text-success">+$20.9k</span>
                    <span className="ms-1 text-muted font-size-13">Since last week</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="card card-h-100">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-6">
                      <span className="text-muted mb-3 lh-1 d-block text-truncate">
                        Number of Trades
                      </span>
                      <h4 className="mb-3">
                        <span className="counter-value" data-target="6258">
                          0
                        </span>
                      </h4>
                    </div>
                    <div className="col-6">
                      <div
                        id="mini-chart2"
                        data-colors='["#5156be"]'
                        className="apex-charts mb-2"
                      ></div>
                    </div>
                  </div>
                  <div className="text-nowrap">
                    <span className="badge bg-soft-danger text-danger">-29 Trades</span>
                    <span className="ms-1 text-muted font-size-13">Since last week</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="card card-h-100">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-6">
                      <span className="text-muted mb-3 lh-1 d-block text-truncate">
                        Invested Amount
                      </span>
                      <h4 className="mb-3">
                        $
                        <span className="counter-value" data-target="4.32">
                          0
                        </span>
                        M
                      </h4>
                    </div>
                    <div className="col-6">
                      <div
                        id="mini-chart3"
                        data-colors='["#5156be"]'
                        className="apex-charts mb-2"
                      ></div>
                    </div>
                  </div>
                  <div className="text-nowrap">
                    <span className="badge bg-soft-success text-success">+ $2.8k</span>
                    <span className="ms-1 text-muted font-size-13">Since last week</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="card card-h-100">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-6">
                      <span className="text-muted mb-3 lh-1 d-block text-truncate">
                        Profit Ration
                      </span>
                      <h4 className="mb-3">
                        <span className="counter-value" data-target="12.57">
                          0
                        </span>
                        %
                      </h4>
                    </div>
                    <div className="col-6">
                      <div
                        id="mini-chart4"
                        data-colors='["#5156be"]'
                        className="apex-charts mb-2"
                      ></div>
                    </div>
                  </div>
                  <div className="text-nowrap">
                    <span className="badge bg-soft-success text-success">+2.95%</span>
                    <span className="ms-1 text-muted font-size-13">Since last week</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-5">
              <div className="card card-h-100">
                <div className="card-body">
                  <div className="d-flex flex-wrap align-items-center mb-4">
                    <h5 className="card-title me-2">Wallet Balance</h5>
                    <div className="ms-auto">
                      <div>
                        <button type="button" className="btn btn-soft-secondary btn-sm">
                          ALL
                        </button>
                        <button type="button" className="btn btn-soft-primary btn-sm">
                          1M
                        </button>
                        <button type="button" className="btn btn-soft-secondary btn-sm">
                          6M
                        </button>
                        <button
                          type="button"
                          className="btn btn-soft-secondary btn-sm active"
                        >
                          1Y
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="row align-items-center">
                    <div className="col-sm">
                      <div
                        id="wallet-balance"
                        data-colors='["#777aca", "#5156be", "#a8aada"]'
                        className="apex-charts"
                      ></div>
                    </div>
                    <div className="col-sm align-self-center">
                      <div className="mt-4 mt-sm-0">
                        <div>
                          <p className="mb-2">
                            <i className="mdi mdi-circle align-middle font-size-10 me-2 text-success"></i>{" "}
                            Bitcoin
                          </p>
                          <h6>
                            0.4412 BTC ={" "}
                            <span className="text-muted font-size-14 fw-normal">
                              $ 4025.32
                            </span>
                          </h6>
                        </div>

                        <div className="mt-4 pt-2">
                          <p className="mb-2">
                            <i className="mdi mdi-circle align-middle font-size-10 me-2 text-primary"></i>{" "}
                            Ethereum
                          </p>
                          <h6>
                            4.5701 ETH ={" "}
                            <span className="text-muted font-size-14 fw-normal">
                              $ 1123.64
                            </span>
                          </h6>
                        </div>

                        <div className="mt-4 pt-2">
                          <p className="mb-2">
                            <i className="mdi mdi-circle align-middle font-size-10 me-2 text-info"></i>{" "}
                            Litecoin
                          </p>
                          <h6>
                            35.3811 LTC ={" "}
                            <span className="text-muted font-size-14 fw-normal">
                              $ 2263.09
                            </span>
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-7">
              <div className="row">
                <div className="col-xl-8">
                  <div className="card card-h-100">
                    <div className="card-body">
                      <div className="d-flex flex-wrap align-items-center mb-4">
                        <h5 className="card-title me-2">Invested Overview</h5>
                        <div className="ms-auto">
                          <select className="form-select form-select-sm">
                            <option value="MAY">May</option>
                            <option value="AP">April</option>
                            <option value="MA">March</option>
                            <option value="FE">February</option>
                            <option value="JA">January</option>
                            <option value="DE">December</option>
                          </select>
                        </div>
                      </div>

                      <div className="row align-items-center">
                        <div className="col-sm">
                          <div
                            id="invested-overview"
                            data-colors='["#5156be", "#34c38f"]'
                            className="apex-charts"
                          ></div>
                        </div>
                        <div className="col-sm align-self-center">
                          <div className="mt-4 mt-sm-0">
                            <p className="mb-1">Invested Amount</p>
                            <h4>$ 6134.39</h4>

                            <p className="text-muted mb-4">
                              {" "}
                              + 0.0012.23 ( 0.2 % ){" "}
                              <i className="mdi mdi-arrow-up ms-1 text-success"></i>
                            </p>

                            <div className="row g-0">
                              <div className="col-6">
                                <div>
                                  <p className="mb-2 text-muted text-uppercase font-size-11">
                                    Income
                                  </p>
                                  <h5 className="fw-medium">$ 2632.46</h5>
                                </div>
                              </div>
                              <div className="col-6">
                                <div>
                                  <p className="mb-2 text-muted text-uppercase font-size-11">
                                    Expenses
                                  </p>
                                  <h5 className="fw-medium">-$ 924.38</h5>
                                </div>
                              </div>
                            </div>

                            <div className="mt-2">
                              <a href="#" className="btn btn-primary btn-sm">
                                View more <i className="mdi mdi-arrow-right ms-1"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-4">
                  <div className="card bg-primary text-white shadow-primary card-h-100">
                    <div className="card-body p-0">
                      <div
                        id="carouselExampleCaptions"
                        className="carousel slide text-center widget-carousel"
                        data-bs-ride="carousel"
                      >
                        <div className="carousel-inner">
                          <div className="carousel-item active">
                            <div className="text-center p-4">
                              <i className="mdi mdi-bitcoin widget-box-1-icon"></i>
                              <div className="avatar-md m-auto">
                                <span className="avatar-title rounded-circle bg-soft-light text-white font-size-24">
                                  <i className="mdi mdi-currency-btc"></i>
                                </span>
                              </div>
                              <h4 className="mt-3 lh-base fw-normal text-white">
                                <b>Bitcoin</b> News
                              </h4>
                              <p className="text-white-50 font-size-13">
                                Bitcoin prices fell sharply amid the global sell-off in
                                equities. Negative news over the Bitcoin past week has
                                dampened Bitcoin basics sentiment for bitcoin.{" "}
                              </p>
                              <button type="button" className="btn btn-light btn-sm">
                                View details <i className="mdi mdi-arrow-right ms-1"></i>
                              </button>
                            </div>
                          </div>

                          <div className="carousel-item">
                            <div className="text-center p-4">
                              <i className="mdi mdi-ethereum widget-box-1-icon"></i>
                              <div className="avatar-md m-auto">
                                <span className="avatar-title rounded-circle bg-soft-light text-white font-size-24">
                                  <i className="mdi mdi-ethereum"></i>
                                </span>
                              </div>
                              <h4 className="mt-3 lh-base fw-normal text-white">
                                <b>ETH</b> News
                              </h4>
                              <p className="text-white-50 font-size-13">
                                Bitcoin prices fell sharply amid the global sell-off in
                                equities. Negative news over the Bitcoin past week has
                                dampened Bitcoin basics sentiment for bitcoin.{" "}
                              </p>
                              <button type="button" className="btn btn-light btn-sm">
                                View details <i className="mdi mdi-arrow-right ms-1"></i>
                              </button>
                            </div>
                          </div>

                          <div className="carousel-item">
                            <div className="text-center p-4">
                              <i className="mdi mdi-litecoin widget-box-1-icon"></i>
                              <div className="avatar-md m-auto">
                                <span className="avatar-title rounded-circle bg-soft-light text-white font-size-24">
                                  <i className="mdi mdi-litecoin"></i>
                                </span>
                              </div>
                              <h4 className="mt-3 lh-base fw-normal text-white">
                                <b>Litecoin</b> News
                              </h4>
                              <p className="text-white-50 font-size-13">
                                Bitcoin prices fell sharply amid the global sell-off in
                                equities. Negative news over the Bitcoin past week has
                                dampened Bitcoin basics sentiment for bitcoin.{" "}
                              </p>
                              <button type="button" className="btn btn-light btn-sm">
                                View details <i className="mdi mdi-arrow-right ms-1"></i>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="carousel-indicators carousel-indicators-rounded">
                          <button
                            type="button"
                            data-bs-target="#carouselExampleCaptions"
                            data-bs-slide-to="0"
                            className="active"
                            aria-current="true"
                            aria-label="Slide 1"
                          ></button>
                          <button
                            type="button"
                            data-bs-target="#carouselExampleCaptions"
                            data-bs-slide-to="1"
                            aria-label="Slide 2"
                          ></button>
                          <button
                            type="button"
                            data-bs-target="#carouselExampleCaptions"
                            data-bs-slide-to="2"
                            aria-label="Slide 3"
                          ></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-8">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex flex-wrap align-items-center mb-4">
                    <h5 className="card-title me-2">Market Overview</h5>
                    <div className="ms-auto">
                      <div>
                        <button type="button" className="btn btn-soft-primary btn-sm">
                          ALL
                        </button>
                        <button type="button" className="btn btn-soft-secondary btn-sm">
                          1M
                        </button>
                        <button type="button" className="btn btn-soft-secondary btn-sm">
                          6M
                        </button>
                        <button
                          type="button"
                          className="btn btn-soft-secondary btn-sm active"
                        >
                          1Y
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="row align-items-center">
                    <div className="col-xl-8">
                      <div>
                        <div
                          id="market-overview"
                          data-colors='["#5156be", "#34c38f"]'
                          className="apex-charts"
                        ></div>
                      </div>
                    </div>
                    <div className="col-xl-4">
                      <div className="p-4">
                        <div>
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm m-auto">
                              <span className="avatar-title rounded-circle bg-soft-light text-dark font-size-16">
                                1
                              </span>
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <span className="font-size-16">Coinmarketcap</span>
                            </div>

                            <div className="flex-shrink-0">
                              <span className="badge rounded-pill badge-soft-success font-size-12 fw-medium">
                                +2.5%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm m-auto">
                              <span className="avatar-title rounded-circle bg-soft-light text-dark font-size-16">
                                2
                              </span>
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <span className="font-size-16">Binance</span>
                            </div>

                            <div className="flex-shrink-0">
                              <span className="badge rounded-pill badge-soft-success font-size-12 fw-medium">
                                +8.3%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm m-auto">
                              <span className="avatar-title rounded-circle bg-soft-light text-dark font-size-16">
                                3
                              </span>
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <span className="font-size-16">Coinbase</span>
                            </div>

                            <div className="flex-shrink-0">
                              <span className="badge rounded-pill badge-soft-danger font-size-12 fw-medium">
                                -3.6%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm m-auto">
                              <span className="avatar-title rounded-circle bg-soft-light text-dark font-size-16">
                                4
                              </span>
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <span className="font-size-16">Yobit</span>
                            </div>

                            <div className="flex-shrink-0">
                              <span className="badge rounded-pill badge-soft-success font-size-12 fw-medium">
                                +7.1%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm m-auto">
                              <span className="avatar-title rounded-circle bg-soft-light text-dark font-size-16">
                                5
                              </span>
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <span className="font-size-16">Bitfinex</span>
                            </div>

                            <div className="flex-shrink-0">
                              <span className="badge rounded-pill badge-soft-danger font-size-12 fw-medium">
                                -0.9%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-2">
                          <a href="#" className="btn btn-primary w-100">
                            See All Balances <i className="mdi mdi-arrow-right ms-1"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex flex-wrap align-items-center mb-4">
                    <h5 className="card-title me-2">Sales by Locations</h5>
                    <div className="ms-auto">
                      <div className="dropdown">
                        <a
                          className="dropdown-toggle text-reset"
                          href="#"
                          id="dropdownMenuButton1"
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <span className="text-muted font-size-12">Sort By:</span>{" "}
                          <span className="fw-medium">
                            World<i className="mdi mdi-chevron-down ms-1"></i>
                          </span>
                        </a>

                        <div
                          className="dropdown-menu dropdown-menu-end"
                          aria-labelledby="dropdownMenuButton1"
                        >
                          <a className="dropdown-item" href="#">
                            USA
                          </a>
                          <a className="dropdown-item" href="#">
                            Russia
                          </a>
                          <a className="dropdown-item" href="#">
                            Australia
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    id="sales-by-locations"
                    data-colors='["#5156be"]'
                    style={{ "max-height": "250px" }}
                  ></div>

                  <div className="px-2 py-2">
                    <p className="mb-1">
                      USA <span className="float-end">75%</span>
                    </p>
                    <div className="progress mt-2" style={{ height: "6px" }}>
                      <div
                        className="progress-bar progress-bar-striped bg-primary"
                        role="progressbar"
                        style={{ width: "75%" }}
                        aria-valuenow="75"
                        aria-valuemin="0"
                        aria-valuemax="75"
                      ></div>
                    </div>

                    <p className="mt-3 mb-1">
                      Russia <span className="float-end">55%</span>
                    </p>
                    <div className="progress mt-2" style={{ height: "6px" }}>
                      <div
                        className="progress-bar progress-bar-striped bg-primary"
                        role="progressbar"
                        style={{ width: "55%" }}
                        aria-valuenow="55"
                        aria-valuemin="0"
                        aria-valuemax="55"
                      ></div>
                    </div>

                    <p className="mt-3 mb-1">
                      Australia <span className="float-end">85%</span>
                    </p>
                    <div className="progress mt-2" style={{ height: "6px" }}>
                      <div
                        className="progress-bar progress-bar-striped bg-primary"
                        role="progressbar"
                        style={{ width: "85%" }}
                        aria-valuenow="85"
                        aria-valuemin="0"
                        aria-valuemax="85"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-4">
              <div className="card">
                <div className="card-header align-items-center d-flex">
                  <h4 className="card-title mb-0 flex-grow-1">Trading</h4>
                  <div className="flex-shrink-0">
                    <ul className="nav nav-tabs-custom card-header-tabs" role="tablist">
                      <li className="nav-item">
                        <a
                          className="nav-link active"
                          data-bs-toggle="tab"
                          href="#buy-tab"
                          role="tab"
                        >
                          Buy
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          data-bs-toggle="tab"
                          href="#sell-tab"
                          role="tab"
                        >
                          Sell
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="card-body">
                  <div className="tab-content">
                    <div className="tab-pane active" id="buy-tab" role="tabpanel">
                      <div className="float-end ms-2">
                        <h5 className="font-size-14">
                          <i className="bx bx-wallet text-primary font-size-16 align-middle me-1"></i>{" "}
                          <a href="#!" className="text-reset text-decoration-underline">
                            $4335.23
                          </a>
                        </h5>
                      </div>
                      <h5 className="font-size-14 mb-4">Buy Coins</h5>
                      <div>
                        <div className="form-group mb-3">
                          <label>Payment method :</label>
                          <select className="form-select">
                            <option>Direct Bank Payment</option>
                            <option>Credit / Debit Card</option>
                            <option>Paypal</option>
                            <option>Payoneer</option>
                            <option>Stripe</option>
                          </select>
                        </div>

                        <div>
                          <label>Add Amount :</label>
                          <div className="input-group mb-3">
                            <label className="input-group-text">Amount</label>
                            <select
                              className="form-select"
                              style={{ "max-height": "90px" }}
                            >
                              <option value="BT">BTC</option>
                              <option value="ET">ETH</option>
                              <option value="LT">LTC</option>
                            </select>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="0.00121255"
                            />
                          </div>

                          <div className="input-group mb-3">
                            <label className="input-group-text">Price</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="$58,245"
                            />
                            <label className="input-group-text">$</label>
                          </div>

                          <div className="input-group mb-3">
                            <label className="input-group-text">Total</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="$36,854.25"
                            />
                          </div>
                        </div>

                        <div className="text-center">
                          <button type="button" className="btn btn-success w-md">
                            Buy Coin
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="tab-pane" id="sell-tab" role="tabpanel">
                      <div className="float-end ms-2">
                        <h5 className="font-size-14">
                          <i className="bx bx-wallet text-primary font-size-16 align-middle me-1"></i>{" "}
                          <a href="#!" className="text-reset text-decoration-underline">
                            $4235.23
                          </a>
                        </h5>
                      </div>
                      <h5 className="font-size-14 mb-4">Sell Coins</h5>

                      <div>
                        <div className="form-group mb-3">
                          <label>Wallet ID :</label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="1cvb254ugxvfcd280ki"
                          />
                        </div>

                        <div>
                          <label>Add Amount :</label>
                          <div className="input-group mb-3">
                            <label className="input-group-text">Amount</label>

                            <select
                              className="form-select"
                              style={{ "max-height": "230px" }}
                            >
                              <option value="BT">BTC</option>
                              <option value="ET">ETH</option>
                              <option value="LT">LTC</option>
                            </select>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="0.00121255"
                            />
                          </div>

                          <div className="input-group mb-3">
                            <label className="input-group-text">Price</label>

                            <input
                              type="text"
                              className="form-control"
                              placeholder="$23,754.25"
                            />

                            <label className="input-group-text">$</label>
                          </div>

                          <div className="input-group mb-3">
                            <label className="input-group-text">Total</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="$6,852.41"
                            />
                          </div>
                        </div>

                        <div className="text-center">
                          <button type="button" className="btn btn-danger w-md">
                            Sell Coin
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-4">
              <div className="card">
                <div className="card-header align-items-center d-flex">
                  <h4 className="card-title mb-0 flex-grow-1">Transactions</h4>
                  <div className="flex-shrink-0">
                    <ul
                      className="nav justify-content-end nav-tabs-custom rounded card-header-tabs"
                      role="tablist"
                    >
                      <li className="nav-item">
                        <a
                          className="nav-link active"
                          data-bs-toggle="tab"
                          href="#transactions-all-tab"
                          role="tab"
                        >
                          All
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          data-bs-toggle="tab"
                          href="#transactions-buy-tab"
                          role="tab"
                        >
                          Buy
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          data-bs-toggle="tab"
                          href="#transactions-sell-tab"
                          role="tab"
                        >
                          Sell
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="card-body px-0">
                  <div className="tab-content">
                    <div
                      className="tab-pane active"
                      id="transactions-all-tab"
                      role="tabpanel"
                    >
                      <div
                        className="table-responsive px-3"
                        data-simplebar
                        style={{ maxHeight: "352px", overflowY: "auto" }}
                      >
                        <table className="table align-middle table-nowrap table-borderless">
                          <tbody>
                            <tr>
                              <td style={{ width: "50px" }}>
                                <div className="font-size-22 text-success">
                                  <i className="bx bx-down-arrow-circle d-block"></i>
                                </div>
                              </td>

                              <td>
                                <div>
                                  <h5 className="font-size-14 mb-1">Buy BTC</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    14 Mar, 2021
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 mb-0">0.016 BTC</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    Coin Value
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 text-muted mb-0">
                                    $125.20
                                  </h5>
                                  <p className="text-muted mb-0 font-size-12">Amount</p>
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <div className="font-size-22 text-danger">
                                  <i className="bx bx-up-arrow-circle d-block"></i>
                                </div>
                              </td>

                              <td>
                                <div>
                                  <h5 className="font-size-14 mb-1">Sell ETH</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    15 Mar, 2021
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 mb-0">0.56 ETH</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    Coin Value
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 text-muted mb-0">
                                    $112.34
                                  </h5>
                                  <p className="text-muted mb-0 font-size-12">Amount</p>
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <div className="font-size-22 text-success">
                                  <i className="bx bx-down-arrow-circle d-block"></i>
                                </div>
                              </td>

                              <td>
                                <div>
                                  <h5 className="font-size-14 mb-1">Buy LTC</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    16 Mar, 2021
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 mb-0">1.88 LTC</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    Coin Value
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 text-muted mb-0">$94.22</h5>
                                  <p className="text-muted mb-0 font-size-12">Amount</p>
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <div className="font-size-22 text-success">
                                  <i className="bx bx-down-arrow-circle d-block"></i>
                                </div>
                              </td>

                              <td>
                                <div>
                                  <h5 className="font-size-14 mb-1">Buy ETH</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    17 Mar, 2021
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 mb-0">0.42 ETH</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    Coin Value
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 text-muted mb-0">$84.32</h5>
                                  <p className="text-muted mb-0 font-size-12">Amount</p>
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <div className="font-size-22 text-danger">
                                  <i className="bx bx-up-arrow-circle d-block"></i>
                                </div>
                              </td>

                              <td>
                                <div>
                                  <h5 className="font-size-14 mb-1">Sell BTC</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    18 Mar, 2021
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 mb-0">0.018 BTC</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    Coin Value
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 text-muted mb-0">
                                    $145.80
                                  </h5>
                                  <p className="text-muted mb-0 font-size-12">Amount</p>
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td style={{ width: "50px" }}>
                                <div className="font-size-22 text-success">
                                  <i className="bx bx-down-arrow-circle d-block"></i>
                                </div>
                              </td>

                              <td>
                                <div>
                                  <h5 className="font-size-14 mb-1">Buy BTC</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    14 Mar, 2021
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 mb-0">0.016 BTC</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    Coin Value
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 text-muted mb-0">
                                    $125.20
                                  </h5>
                                  <p className="text-muted mb-0 font-size-12">Amount</p>
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <div className="font-size-22 text-danger">
                                  <i className="bx bx-up-arrow-circle d-block"></i>
                                </div>
                              </td>

                              <td>
                                <div>
                                  <h5 className="font-size-14 mb-1">Sell ETH</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    15 Mar, 2021
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 mb-0">0.56 ETH</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    Coin Value
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 text-muted mb-0">
                                    $112.34
                                  </h5>
                                  <p className="text-muted mb-0 font-size-12">Amount</p>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="tab-pane" id="transactions-buy-tab" role="tabpanel">
                      <div
                        className="table-responsive px-3"
                        data-simplebar
                        style={{ maxHeight: "352px", overflowY: "auto" }}
                      >
                        <table className="table align-middle table-nowrap table-borderless">
                          <tbody>
                            <tr>
                              <td style={{ width: "50px" }}>
                                <div className="font-size-22 text-success">
                                  <i className="bx bx-down-arrow-circle d-block"></i>
                                </div>
                              </td>

                              <td>
                                <div>
                                  <h5 className="font-size-14 mb-1">Buy BTC</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    14 Mar, 2021
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 mb-0">0.016 BTC</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    Coin Value
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 text-muted mb-0">
                                    $125.20
                                  </h5>
                                  <p className="text-muted mb-0 font-size-12">Amount</p>
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <div className="font-size-22 text-success">
                                  <i className="bx bx-down-arrow-circle d-block"></i>
                                </div>
                              </td>

                              <td>
                                <div>
                                  <h5 className="font-size-14 mb-1">Buy BTC</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    18 Mar, 2021
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 mb-0">0.018 BTC</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    Coin Value
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 text-muted mb-0">
                                    $145.80
                                  </h5>
                                  <p className="text-muted mb-0 font-size-12">Amount</p>
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <div className="font-size-22 text-success">
                                  <i className="bx bx-down-arrow-circle d-block"></i>
                                </div>
                              </td>

                              <td>
                                <div>
                                  <h5 className="font-size-14 mb-1">Buy LTC</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    16 Mar, 2021
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 mb-0">1.88 LTC</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    Coin Value
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 text-muted mb-0">$94.22</h5>
                                  <p className="text-muted mb-0 font-size-12">Amount</p>
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <div className="font-size-22 text-success">
                                  <i className="bx bx-down-arrow-circle d-block"></i>
                                </div>
                              </td>

                              <td>
                                <div>
                                  <h5 className="font-size-14 mb-1">Buy ETH</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    15 Mar, 2021
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 mb-0">0.56 ETH</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    Coin Value
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 text-muted mb-0">
                                    $112.34
                                  </h5>
                                  <p className="text-muted mb-0 font-size-12">Amount</p>
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <div className="font-size-22 text-success">
                                  <i className="bx bx-down-arrow-circle d-block"></i>
                                </div>
                              </td>

                              <td>
                                <div>
                                  <h5 className="font-size-14 mb-1">Buy ETH</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    17 Mar, 2021
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 mb-0">0.42 ETH</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    Coin Value
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 text-muted mb-0">$84.32</h5>
                                  <p className="text-muted mb-0 font-size-12">Amount</p>
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <div className="font-size-22 text-success">
                                  <i className="bx bx-down-arrow-circle d-block"></i>
                                </div>
                              </td>

                              <td>
                                <div>
                                  <h5 className="font-size-14 mb-1">Buy ETH</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    15 Mar, 2021
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 mb-0">0.56 ETH</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    Coin Value
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 text-muted mb-0">
                                    $112.34
                                  </h5>
                                  <p className="text-muted mb-0 font-size-12">Amount</p>
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td style={{ width: "50px" }}>
                                <div className="font-size-22 text-success">
                                  <i className="bx bx-down-arrow-circle d-block"></i>
                                </div>
                              </td>

                              <td>
                                <div>
                                  <h5 className="font-size-14 mb-1">Buy BTC</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    14 Mar, 2021
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 mb-0">0.016 BTC</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    Coin Value
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 text-muted mb-0">
                                    $125.20
                                  </h5>
                                  <p className="text-muted mb-0 font-size-12">Amount</p>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="tab-pane" id="transactions-sell-tab" role="tabpanel">
                      <div
                        className="table-responsive px-3"
                        data-simplebar
                        style={{ maxHeight: "352px", overflowY: "auto" }}
                      >
                        <table className="table align-middle table-nowrap table-borderless">
                          <tbody>
                            <tr>
                              <td>
                                <div className="font-size-22 text-danger">
                                  <i className="bx bx-up-arrow-circle d-block"></i>
                                </div>
                              </td>

                              <td>
                                <div>
                                  <h5 className="font-size-14 mb-1">Sell ETH</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    15 Mar, 2021
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 mb-0">0.56 ETH</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    Coin Value
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 text-muted mb-0">
                                    $112.34
                                  </h5>
                                  <p className="text-muted mb-0 font-size-12">Amount</p>
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td style={{ width: "50px" }}>
                                <div className="font-size-22 text-danger">
                                  <i className="bx bx-up-arrow-circle d-block"></i>
                                </div>
                              </td>

                              <td>
                                <div>
                                  <h5 className="font-size-14 mb-1">Sell BTC</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    14 Mar, 2021
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 mb-0">0.016 BTC</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    Coin Value
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 text-muted mb-0">
                                    $125.20
                                  </h5>
                                  <p className="text-muted mb-0 font-size-12">Amount</p>
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <div className="font-size-22 text-danger">
                                  <i className="bx bx-up-arrow-circle d-block"></i>
                                </div>
                              </td>

                              <td>
                                <div>
                                  <h5 className="font-size-14 mb-1">Sell BTC</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    18 Mar, 2021
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 mb-0">0.018 BTC</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    Coin Value
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 text-muted mb-0">
                                    $145.80
                                  </h5>
                                  <p className="text-muted mb-0 font-size-12">Amount</p>
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <div className="font-size-22 text-danger">
                                  <i className="bx bx-up-arrow-circle d-block"></i>
                                </div>
                              </td>

                              <td>
                                <div>
                                  <h5 className="font-size-14 mb-1">Sell ETH</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    15 Mar, 2021
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 mb-0">0.56 ETH</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    Coin Value
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 text-muted mb-0">
                                    $112.34
                                  </h5>
                                  <p className="text-muted mb-0 font-size-12">Amount</p>
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <div className="font-size-22 text-danger">
                                  <i className="bx bx-up-arrow-circle d-block"></i>
                                </div>
                              </td>

                              <td>
                                <div>
                                  <h5 className="font-size-14 mb-1">Sell LTC</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    16 Mar, 2021
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 mb-0">1.88 LTC</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    Coin Value
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 text-muted mb-0">$94.22</h5>
                                  <p className="text-muted mb-0 font-size-12">Amount</p>
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <div className="font-size-22 text-danger">
                                  <i className="bx bx-up-arrow-circle d-block"></i>
                                </div>
                              </td>

                              <td>
                                <div>
                                  <h5 className="font-size-14 mb-1">Sell ETH</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    17 Mar, 2021
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 mb-0">0.42 ETH</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    Coin Value
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 text-muted mb-0">$84.32</h5>
                                  <p className="text-muted mb-0 font-size-12">Amount</p>
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td style={{ width: "50px" }}>
                                <div className="font-size-22 text-danger">
                                  <i className="bx bx-up-arrow-circle d-block"></i>
                                </div>
                              </td>

                              <td>
                                <div>
                                  <h5 className="font-size-14 mb-1">Sell BTC</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    14 Mar, 2021
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 mb-0">0.016 BTC</h5>
                                  <p className="text-muted mb-0 font-size-12">
                                    Coin Value
                                  </p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 text-muted mb-0">
                                    $125.20
                                  </h5>
                                  <p className="text-muted mb-0 font-size-12">Amount</p>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-4">
              <div className="card">
                <div className="card-header align-items-center d-flex">
                  <h4 className="card-title mb-0 flex-grow-1">Recent Activity</h4>
                  <div className="flex-shrink-0">
                    <select className="form-select form-select-sm mb-0 my-n1">
                      <option value="Today">Today</option>
                      <option value="Yesterday">Yesterday</option>
                      <option value="Week">Last Week</option>
                      <option value="Month">Last Month</option>
                    </select>
                  </div>
                </div>

                <div className="card-body px-0">
                  <div
                    className="px-3"
                    data-simplebar
                    style={{ maxHeight: "352px", overflowY: "auto" }}
                  >
                    <ul className="list-unstyled activity-wid mb-0">
                      <li className="activity-list activity-border">
                        <div className="activity-icon avatar-md">
                          <span className="avatar-title bg-soft-warning text-warning rounded-circle">
                            <i className="bx bx-bitcoin font-size-24"></i>
                          </span>
                        </div>
                        <div className="timeline-list-item">
                          <div className="d-flex">
                            <div className="flex-grow-1 overflow-hidden me-4">
                              <h5 className="font-size-14 mb-1">24/05/2021, 18:24:56</h5>
                              <p className="text-truncate text-muted font-size-13">
                                0xb77ad0099e21d4fca87fa4ca92dda1a40af9e05d205e53f38bf026196fa2e431
                              </p>
                            </div>
                            <div className="flex-shrink-0 text-end me-3">
                              <h6 className="mb-1">+0.5 BTC</h6>
                              <div className="font-size-13">$178.53</div>
                            </div>

                            <div className="flex-shrink-0 text-end">
                              <div className="dropdown">
                                <a
                                  className="text-muted dropdown-toggle font-size-24"
                                  role="button"
                                  data-bs-toggle="dropdown"
                                  aria-haspopup="true"
                                >
                                  <i className="mdi mdi-dots-vertical"></i>
                                </a>

                                <div className="dropdown-menu dropdown-menu-end">
                                  <a className="dropdown-item" href="#">
                                    Action
                                  </a>
                                  <a className="dropdown-item" href="#">
                                    Another action
                                  </a>
                                  <a className="dropdown-item" href="#">
                                    Something else here
                                  </a>
                                  <div className="dropdown-divider"></div>
                                  <a className="dropdown-item" href="#">
                                    Separated link
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>

                      <li className="activity-list activity-border">
                        <div className="activity-icon avatar-md">
                          <span className="avatar-title bg-soft-primary text-primary rounded-circle">
                            <i className="mdi mdi-ethereum font-size-24"></i>
                          </span>
                        </div>
                        <div className="timeline-list-item">
                          <div className="d-flex">
                            <div className="flex-grow-1 overflow-hidden me-4">
                              <h5 className="font-size-14 mb-1">24/05/2021, 18:24:56</h5>
                              <p className="text-truncate text-muted font-size-13">
                                0xb77ad0099e21d4fca87fa4ca92dda1a40af9e05d205e53f38bf026196fa2e431
                              </p>
                            </div>
                            <div className="flex-shrink-0 text-end me-3">
                              <h6 className="mb-1">-20.5 ETH</h6>
                              <div className="font-size-13">$3541.45</div>
                            </div>

                            <div className="flex-shrink-0 text-end">
                              <div className="dropdown">
                                <a
                                  className="text-muted dropdown-toggle font-size-24"
                                  role="button"
                                  data-bs-toggle="dropdown"
                                  aria-haspopup="true"
                                >
                                  <i className="mdi mdi-dots-vertical"></i>
                                </a>

                                <div className="dropdown-menu dropdown-menu-end">
                                  <a className="dropdown-item" href="#">
                                    Action
                                  </a>
                                  <a className="dropdown-item" href="#">
                                    Another action
                                  </a>
                                  <a className="dropdown-item" href="#">
                                    Something else here
                                  </a>
                                  <div className="dropdown-divider"></div>
                                  <a className="dropdown-item" href="#">
                                    Separated link
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>

                      <li className="activity-list activity-border">
                        <div className="activity-icon avatar-md">
                          <span className="avatar-title bg-soft-warning text-warning rounded-circle">
                            <i className="bx bx-bitcoin font-size-24"></i>
                          </span>
                        </div>
                        <div className="timeline-list-item">
                          <div className="d-flex">
                            <div className="flex-grow-1 overflow-hidden me-4">
                              <h5 className="font-size-14 mb-1">24/05/2021, 18:24:56</h5>
                              <p className="text-truncate text-muted font-size-13">
                                0xb77ad0099e21d4fca87fa4ca92dda1a40af9e05d205e53f38bf026196fa2e431
                              </p>
                            </div>
                            <div className="flex-shrink-0 text-end me-3">
                              <h6 className="mb-1">+0.5 BTC</h6>
                              <div className="font-size-13">$5791.45</div>
                            </div>

                            <div className="flex-shrink-0 text-end">
                              <div className="dropdown">
                                <a
                                  className="text-muted dropdown-toggle font-size-24"
                                  role="button"
                                  data-bs-toggle="dropdown"
                                  aria-haspopup="true"
                                >
                                  <i className="mdi mdi-dots-vertical"></i>
                                </a>

                                <div className="dropdown-menu dropdown-menu-end">
                                  <a className="dropdown-item" href="#">
                                    Action
                                  </a>
                                  <a className="dropdown-item" href="#">
                                    Another action
                                  </a>
                                  <a className="dropdown-item" href="#">
                                    Something else here
                                  </a>
                                  <div className="dropdown-divider"></div>
                                  <a className="dropdown-item" href="#">
                                    Separated link
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>

                      <li className="activity-list activity-border">
                        <div className="activity-icon avatar-md">
                          <span className="avatar-title bg-soft-primary text-primary rounded-circle">
                            <i className="mdi mdi-litecoin font-size-24"></i>
                          </span>
                        </div>
                        <div className="timeline-list-item">
                          <div className="d-flex">
                            <div className="flex-grow-1 overflow-hidden me-4">
                              <h5 className="font-size-14 mb-1">24/05/2021, 18:24:56</h5>
                              <p className="text-truncate text-muted font-size-13">
                                0xb77ad0099e21d4fca87fa4ca92dda1a40af9e05d205e53f38bf026196fa2e431
                              </p>
                            </div>
                            <div className="flex-shrink-0 text-end me-3">
                              <h6 className="mb-1">-1.5 LTC</h6>
                              <div className="font-size-13">$5791.45</div>
                            </div>

                            <div className="flex-shrink-0 text-end">
                              <div className="dropdown">
                                <a
                                  className="text-muted dropdown-toggle font-size-24"
                                  role="button"
                                  data-bs-toggle="dropdown"
                                  aria-haspopup="true"
                                >
                                  <i className="mdi mdi-dots-vertical"></i>
                                </a>

                                <div className="dropdown-menu dropdown-menu-end">
                                  <a className="dropdown-item" href="#">
                                    Action
                                  </a>
                                  <a className="dropdown-item" href="#">
                                    Another action
                                  </a>
                                  <a className="dropdown-item" href="#">
                                    Something else here
                                  </a>
                                  <div className="dropdown-divider"></div>
                                  <a className="dropdown-item" href="#">
                                    Separated link
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>

                      <li className="activity-list activity-border">
                        <div className="activity-icon avatar-md">
                          <span className="avatar-title bg-soft-warning text-warning rounded-circle">
                            <i className="bx bx-bitcoin font-size-24"></i>
                          </span>
                        </div>
                        <div className="timeline-list-item">
                          <div className="d-flex">
                            <div className="flex-grow-1 overflow-hidden me-4">
                              <h5 className="font-size-14 mb-1">24/05/2021, 18:24:56</h5>
                              <p className="text-truncate text-muted font-size-13">
                                0xb77ad0099e21d4fca87fa4ca92dda1a40af9e05d205e53f38bf026196fa2e431
                              </p>
                            </div>
                            <div className="flex-shrink-0 text-end me-3">
                              <h6 className="mb-1">+0.5 BTC</h6>
                              <div className="font-size-13">$5791.45</div>
                            </div>

                            <div className="flex-shrink-0 text-end">
                              <div className="dropdown">
                                <a
                                  className="text-muted dropdown-toggle font-size-24"
                                  role="button"
                                  data-bs-toggle="dropdown"
                                  aria-haspopup="true"
                                >
                                  <i className="mdi mdi-dots-vertical"></i>
                                </a>

                                <div className="dropdown-menu dropdown-menu-end">
                                  <a className="dropdown-item" href="#">
                                    Action
                                  </a>
                                  <a className="dropdown-item" href="#">
                                    Another action
                                  </a>
                                  <a className="dropdown-item" href="#">
                                    Something else here
                                  </a>
                                  <div className="dropdown-divider"></div>
                                  <a className="dropdown-item" href="#">
                                    Separated link
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>

                      <li className="activity-list">
                        <div className="activity-icon avatar-md">
                          <span className="avatar-title bg-soft-primary text-primary rounded-circle">
                            <i className="mdi mdi-litecoin font-size-24"></i>
                          </span>
                        </div>
                        <div className="timeline-list-item">
                          <div className="d-flex">
                            <div className="flex-grow-1 overflow-hidden me-4">
                              <h5 className="font-size-14 mb-1">24/05/2021, 18:24:56</h5>
                              <p className="text-truncate text-muted font-size-13">
                                0xb77ad0099e21d4fca87fa4ca92dda1a40af9e05d205e53f38bf026196fa2e431
                              </p>
                            </div>
                            <div className="flex-shrink-0 text-end me-3">
                              <h6 className="mb-1">+.55 LTC</h6>
                              <div className="font-size-13">$91.45</div>
                            </div>

                            <div className="flex-shrink-0 text-end">
                              <div className="dropdown">
                                <a
                                  className="text-muted dropdown-toggle font-size-24"
                                  role="button"
                                  data-bs-toggle="dropdown"
                                  aria-haspopup="true"
                                >
                                  <i className="mdi mdi-dots-vertical"></i>
                                </a>

                                <div className="dropdown-menu dropdown-menu-end">
                                  <a className="dropdown-item" href="#">
                                    Action
                                  </a>
                                  <a className="dropdown-item" href="#">
                                    Another action
                                  </a>
                                  <a className="dropdown-item" href="#">
                                    Something else here
                                  </a>
                                  <div className="dropdown-divider"></div>
                                  <a className="dropdown-item" href="#">
                                    Separated link
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
