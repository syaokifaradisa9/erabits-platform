<?php

namespace App\Datatables;

use App\Http\Requests\Common\DatatableRequest;

interface DatatableService{
    public function getDatatable(DatatableRequest $request, $loggedUser, $additionalData = []);
    public function printPdf(DatatableRequest $request, $loggedUser, $additionalData = []);
    public function printExcel(DatatableRequest $request, $loggedUser, $additionalData = []);
}

?>
