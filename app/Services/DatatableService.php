<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

abstract class DatatableService
{
    abstract public function builder(): Builder;
    abstract public function getColumns(): array;

    public function getDatatable(Request $request)
    {
        $builder = $this->builder();
        $columns = $this->getColumns();

        // Handle searching
        if ($request->filled('search')) {
            $search = $request->input('search');
            $builder->where(function ($query) use ($columns, $search) {
                foreach ($columns as $column) {
                    if ($column['searchable']) {
                        if (isset($column['relation'])) {
                            $query->orWhereHas($column['relation'], function ($q) use ($column, $search) {
                                $q->where($column['name'], 'like', "%{$search}%");
                            });
                        } else {
                            $query->orWhere($column['name'], 'like', "%{$search}%");
                        }
                    }
                }
            });
        }

        // Handle individual column filtering
        foreach ($columns as $column) {
            if ($request->filled($column['name'])) {
                $filterValue = $request->input($column['name']);
                 if (isset($column['relation'])) {
                    $builder->whereHas($column['relation'], function ($q) use ($column, $filterValue) {
                        $q->where($column['name'], 'like', "%{$filterValue}%");
                    });
                } else {
                    $builder->where($column['name'], 'like', "%{$filterValue}%");
                }
            }
        }

        // Handle sorting
        if ($request->filled('sort_by') && $request->filled('sort_direction')) {
            $builder->orderBy($request->input('sort_by'), $request->input('sort_direction'));
        }

        // Handle pagination
        $limit = $request->input('limit', 10);
        $data = $builder->paginate($limit);

        $data->appends($request->all());

        return response()->json($data);
    }
}
