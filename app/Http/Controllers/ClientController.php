<?php

namespace App\Http\Controllers;

use App\DataTransferObjects\UserDTO;
use App\Services\ClientService;
use App\Datatables\ClientDatatableService;
use App\Http\Requests\ClientRequest;
use App\Http\Requests\Common\DatatableRequest;
use App\Models\User;
use App\Services\UserService;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function __construct(
        protected ClientDatatableService $datatableService,
        protected ClientService $service,
        protected UserService $userService
    ) {
    }

    public function index()
    {
        return Inertia::render('Client/Index');
    }

    public function create()
    {
        return Inertia::render('Client/Create');
    }

    public function store(ClientRequest $request)
    {
        $client = $this->service->store(
            UserDTO::fromAppRequest($request)
        );

        return to_route('clients.index')->with('success', "Berhasil menambahkan data $client->name");
    }

    public function edit(User $client)
    {
        return Inertia::render('Client/Create', compact('client'));
    }

    public function update(ClientRequest $request, User $client)
    {
        $client = $this->service->update(
            $client->id,
            UserDTO::fromAppRequest($request)
        );

        return to_route('clients.index')->with('success', "Berhasil mengubah data $client->name");
    }

    public function delete(User $client)
    {
        $this->userService->delete($client->id);

        return to_route('clients.index')->with('success', "Berhasil menghapus data $client->name");
    }

    public function datatable(DatatableRequest $request)
    {
        return $this->datatableService->getDatatable($request);
    }
}
