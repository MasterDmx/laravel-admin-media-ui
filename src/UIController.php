<?php

namespace MasterDmx\LaravelAdminMediaUI;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use MasterDmx\LaravelMedia\Exceptions\UndefinedContextException;
use MasterDmx\LaravelMedia\Exceptions\ValidationException;
use MasterDmx\LaravelMedia\MediaManager;

class UIController extends Controller
{
    private MediaManager $manager;

    public function __construct(MediaManager $manager)
    {
        $this->manager = $manager;
    }

    /**
     * Весь список файлов
     */
    public function files()
    {
        return $this->manager->getAll()->sortByUpload()->values();
    }

    /**
     * Загрузка файла с компа
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file' => ['required']
        ]);

        return $this->exceptionResponse(function () use ($request) {
            return $this->manager->add(
                $request->file('file'),
                $request->get('context', 'default')
            );
        });
    }

    /**
     * Загрузка файла по ссылке
     */
    public function uploadByUrl(Request $request)
    {
        $request->validate([
            'url' => ['required']
        ]);

        return $this->exceptionResponse(function () use ($request) {
            return $this->manager->add(
                $request->input('url'),
                $request->input('context', 'default')
            );
        });
    }

    /**
     * Удаление файла
     */
    public function remove(string $id)
    {
        return $this->manager->remove($id);
    }

    /**
     * Обновление описания информации файла
     */
    public function update(string $id, Request $request)
    {
        return $this->manager->updateMeta($id, $request->get('name') ?? '', $request->get('title') ?? '');
    }

    /**
     * Выбор файла для работы
     */
    public function use(Request $request)
    {
        $request->validate([
            'id' => 'required|string',
        ]);

        try {
            return $this->manager->applyContext($request->input('id'), $request->input('context', 'default'));
        } catch (\Exception $th) {
            return response(['status' => 'error'], 400);
        }
    }

    /**
     * Расстановка статусов при исключениях для отдачи фронту
     */
    protected function exceptionResponse(callable $action)
    {
        try {
            return $action();
        } catch (ValidationException $th) {
            return response(['status' => 'validation_error', 'errors' => $th->getErrors()], 422);
        } catch (UndefinedContextException $th) {
            return response(['status' => 'undefined_context', 'message' => $th->getMessage()], 400);
        } catch (\Exception $th) {
            return response(['status' => 'error', 'message' => $th->getMessage()], 400);
        }
    }
}
