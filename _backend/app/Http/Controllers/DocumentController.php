<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Models\Document;
use App\Http\Requests\StoreDocumentRequest;
use App\Http\Requests\UpdateDocumentRequest;

class DocumentController extends Controller
{

    private $document;

    public function __construct(Document $document)
    {
        $this->document = $document;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       // $documents = Document::all();
       // return $documents;

        $documents = Document::with('partner', 'employee.user')->get();
        return response()->json($documents);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDocumentRequest $request)
    {
        $file = $request->file('document');
        $file_urn = $file->store('documents', 'public');

        $document = $this->document->create([
            'partner_id' =>  $request->partner_id, 
            'title'      =>  $request->title,
            'date'       =>  $request->date,
            'document'   =>  $file_urn,
            'validity'   =>  $request->validity    
        ]);

        return response()->json($document, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Document $document)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDocumentRequest $request, Document $document)
    {
        try {

            
          
            if ($request->hasFile('document')) {
                // Armazena o novo arquivo de livrete
                $file = $request->file('document');
                $file_urn = $file->store('documents', 'public');
                
            }
    
            $document->update([
                'partner_id' =>  $request->partner_id, 
                'title'      =>  $request->title,
                'date'       =>  $request->date,
                'document'   =>  $file_urn,
                'validity'   =>  $request->validity    
            ]);
 
            return response()->json($document, 201);


        } catch (\Exception $e) {
            Log::error('Erro de autorização: ' . $e->getMessage());
            throw $e;
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Document $document)
    {
        //
    }

    public function download($id)
{
    // Buscar o documento com o ID fornecido
    $document = Document::findOrFail($id);
    
    // Determine o caminho completo do arquivo do documento
    $filePath = 'app/public/proof/' . $document->document;
    
    // Verificar se o arquivo existe
    if (Storage::exists($filePath)) {
        // Retorna o arquivo de imagem
        return response()->file(storage_path("app/{$filePath}"));
    } else {
        // Se o arquivo não existir, retorne uma resposta de erro adequada
        return response()->json(['error' => 'Arquivo não encontrado'], 404);
    }
}
}
