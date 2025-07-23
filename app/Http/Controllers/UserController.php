<?php

namespace App\Http\Controllers;

use App\Datatables\UserDatatableService;
use App\DataTransferObjects\UserDTO;
use App\Http\Requests\Common\DatatableRequest;
use App\Http\Requests\UserRequest;
use App\Models\User;
use App\Services\RoleService;
use App\Services\ServiceItemTypeService;
use App\Services\UserService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    private $loggedUser;
    public function __construct(
        protected UserService $service,
        protected  RoleService $roleService,
        protected UserDatatableService $datatableService,
        protected ServiceItemTypeService $serviceItemTypeService
    )
    {
        $this->loggedUser = Auth::user();
    }

    public function index(){
        return Inertia::render("User/Index");
    }

    public function create(){
        $roles = $this->roleService->getSubordinate($this->loggedUser);
        $serviceItemTypes = $this->serviceItemTypeService->getActiveService();
        return Inertia::render("User/Create", compact('serviceItemTypes', 'roles'));
    }

    public function store(UserRequest $request){
        $user = $this->service->store(
            UserDTO::fromAppRequest($request)
        );

        $user->assignRole($request->input('roles'));

        return to_route("users.index")
            ->with("success", "Berhasil menambahkan data $user->name");
    }

    public function edit(User $user){
        $roles = $this->roleService->getSubordinate($this->loggedUser);
        $serviceItemTypes = $this->serviceItemTypeService->getActiveService();
        $user->load('roles');
        return Inertia::render("User/Create", compact("user", "serviceItemTypes", "roles"));
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
}
