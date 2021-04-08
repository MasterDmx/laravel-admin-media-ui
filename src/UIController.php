<?php

namespace MasterDmx\LaravelAdminMediaUI;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use MasterDmx\LaravelMedia\Exceptions\ValidationException;
use MasterDmx\LaravelMedia\MediaManager;

class UIController extends Controller
{
    private MediaManager $manager;

    public function __construct(MediaManager $manager)
    {
        $this->manager = $manager;
    }

    public function files()
    {
        return $this->manager->getAll()->sortByUpload()->values();
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => ['required']
        ]);

        try {
            return $this->manager->add(
                $request->file('file'),
                $request->get('context', 'default')
            );
        } catch (ValidationException $th) {
            return response(['status' => 'validation_error', 'errors' => $th->getErrors()], 422);
        } catch (\Exception $th) {
            return response(['status' => 'error'], 400);
        }
    }

    public function remove(string $id)
    {
        return $this->manager->remove($id);
    }

    public function update(string $id, Request $request)
    {
        return $this->manager->updateMeta($id, $request->get('name') ?? '', $request->get('title') ?? '');
    }

    public function use(string $id, Request $request)
    {
        try {
            return $this->manager->applyContext($id, $request->get('context') ?? 'default');
        } catch (\Exception $th) {
            return response(['status' => 'error'], 400);
        }

    }
}
