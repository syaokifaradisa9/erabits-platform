<?php

namespace App\Http\Controllers;

use App\Datatables\UserDatatableService;
use App\DataTransferObjects\UserDTO;
use App\Http\Requests\Common\DatatableRequest;
use App\Http\Requests\UserRequest;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    private $loggedUser;
    public function __construct(
        protected UserService $service,
        protected UserDatatableService $datatableService,
    )
    {
        $this->loggedUser = Auth::user();
    }

    public function index(){
        return Inertia::render("User/Index");
    }

    public function create(){
        return Inertia::render("User/Create");
    }

    public function store(UserRequest $request){
        $user = $this->service->store(
            UserDTO::fromAppRequest($request)
        );

        return to_route("users.index")
            ->with("success", "Berhasil menambahkan data $user->name");
    }

    public function edit(User $user){
        return Inertia::render("User/Create", compact("user"));
    }

    public function update(UserRequest $request, User $user){
        $user = $this->service->update(
            $user->id,
            UserDTO::fromAppRequest($request)
        );

        return to_route("users.index")
            ->with("success", "Berhasil mengubah data $user->name");
    }

    public function delete(User $user){
        $this->service->delete($user->id);

        return to_route("users.index")
            ->with("success", "Berhasil menghapus data $user->name");
    }

    public function datatable(DatatableRequest $request){
        return $this->datatableService->getDatatable($request, $this->loggedUser);
    }

    public function printPdf(DatatableRequest $request){
        return $this->datatableService->printPdf($request, $this->loggedUser);
    }

    public function printExcel(DatatableRequest $request){
        return $this->datatableService->printExcel($request, $this->loggedUser);
    }
}
